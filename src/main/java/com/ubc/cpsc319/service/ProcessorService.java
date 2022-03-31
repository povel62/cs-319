package com.ubc.cpsc319.service;

import com.ubc.cpsc319.entity.*;
import com.ubc.cpsc319.evaluation.RuleEvalStruct;
import microsoft.exchange.webservices.data.core.ExchangeService;
import microsoft.exchange.webservices.data.core.PropertySet;
import microsoft.exchange.webservices.data.core.service.item.EmailMessage;
import microsoft.exchange.webservices.data.core.service.item.Item;
import microsoft.exchange.webservices.data.core.service.schema.EmailMessageSchema;
import microsoft.exchange.webservices.data.property.complex.Attachment;
import microsoft.exchange.webservices.data.property.complex.EmailAddress;
import microsoft.exchange.webservices.data.property.complex.ItemAttachment;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.Future;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@Service
public class ProcessorService {

    @Autowired
    EmailService emailService;

    @Autowired
    SystemConfigService systemConfigService;

    @Autowired
    AttachmentService attachmentService;

    @Autowired
    EmailRuleMatchService emailRuleMatchServiceService;

    @Autowired
    RuleService ruleService;

    @Autowired
    RuleEvaluatorService evaluator;

    private String resolvePythonScriptPath(String filename) {
        File file = new File(filename);
        return file.getAbsolutePath();
    }

    private List<String> readProcessOutput(InputStream inputStream) throws IOException {
        try (BufferedReader output = new BufferedReader(new InputStreamReader(inputStream))) {
            return output.lines()
                    .collect(Collectors.toList());
        }
    }

    public void processItem(Item item, ExchangeService es) throws Exception {
        evaluator.initService();
        item.load();
        try {
            ItemAttachment at = ((ItemAttachment) item.getAttachments().getItems().get(0));
            at.load();
            EmailMessage em = ((EmailMessage) at.getItem());

            Email mail = new Email();
            mail.setSize(em.getSize());
            mail.setBody(em.getBody().toString() == null ? "" : em.getBody().toString());
            mail.setSubject(em.getSubject() == null ? "" : em.getSubject());
            mail.setFromAddress(em.getFrom().toString());
            mail.setToAddress(em.getToRecipients().getItems().stream().map(EmailAddress::toString).collect(Collectors.joining(", ")));
            mail.setCcAddress(em.getCcRecipients().getItems().stream().map(EmailAddress::toString).collect(Collectors.joining(", ")));
            mail.setBccAddress(em.getBccRecipients().getItems().stream().map(EmailAddress::toString).collect(Collectors.joining(", ")));
            mail.setDateTimeSent(em.getDateTimeSent());
            mail = emailService.createEntityIfNotExisting(mail);

            List<com.ubc.cpsc319.entity.Attachment> attachmentList = new ArrayList<>();
            for (int i = 0; i < em.getAttachments().getItems().size(); i++) {
                Attachment attachment = em.getAttachments().getItems().get(i);
                attachment.load();
                com.ubc.cpsc319.entity.Attachment attach = new com.ubc.cpsc319.entity.Attachment();
                attach.setName(attachment.getName());
                attach.setSize(attachment.getSize());
                attach.setEmail(mail);
                attach = attachmentService.createEntityIfNotExisting(attach);
                attachmentList.add(attach);
//                List<com.ubc.cpsc319.entity.Attachment> attachments = mail.getAttachments();
//                attachments.add(attach);
//                mail.setAttachments(attachments);
            }

            List<Rule> rules = ruleService.findByIsInactiveFalse();
            List<CompletableFuture<RuleEvalStruct>> futures = new ArrayList<>();
            // Spin off a async function for each rule
            for (Rule rule : rules) {
                Email mailCopy = mail;
                CompletableFuture<RuleEvalStruct> future = CompletableFuture.supplyAsync(new Supplier<RuleEvalStruct>() {
                    public RuleEvalStruct get() {
                        return evaluator.isHit(rule, mailCopy, attachmentList);
                    }
                });
                futures.add(future);
            }

            // Wait for completion of all async operations
            try {
                CompletableFuture.allOf(futures.toArray(new CompletableFuture[futures.size()])).join();
            } catch(CompletionException e) {
                e.printStackTrace();
                System.out.println(e.getMessage());
            }

            // Record all email rule matches and calculate score
            List<EmailRuleMatch> rulesMatchedWithEmail = new ArrayList<>();
            BigDecimal mailScore = new BigDecimal(1.0);
            for(Future<RuleEvalStruct> future: futures) {
                RuleEvalStruct res = future.get();
                if(res.isHit) {
                    // Record email rule match
                    EmailRuleMatch erm = new EmailRuleMatch();
                    erm.setEmail(mail);
                    erm.setRule(res.rule);
                    emailRuleMatchServiceService.createEntityIfNotExisting(erm);
                    rulesMatchedWithEmail.add(erm);

                    // Multiple rule score by 1's complement of risk level
                    mailScore = mailScore.multiply(new BigDecimal(1.0).subtract(new BigDecimal(res.rule.getRiskLevel())));
                }
            }

            String emailAction;
            String suspiciousMsg = "";
            SystemConfig sysConfig = systemConfigService.findByName("thresholds");
            JSONArray thresholds;

            if(sysConfig == null) {
                thresholds = new JSONArray("[0.33,0.66]");
            } else {
                thresholds = new JSONArray(sysConfig.getValue());
            }
            mail.setAttachments(attachmentList);
            mail.setEmailRuleMatchList(rulesMatchedWithEmail);
            mail.setScore(new BigDecimal(1.0).subtract(mailScore).doubleValue());
            double suspiciousThreshold = thresholds.getDouble(0); // default .33
            double quarantineThreshold = thresholds.getDouble(1); // default .66
            if (mailScore.compareTo(new BigDecimal(1.0).subtract(new BigDecimal(quarantineThreshold))) == -1) {
                mail.setEmailCondition(EmailCondition.SPAM);
                mail.setIteratedEmailCondition(EmailCondition.SPAM);
                emailService.save(mail); // this updates, so stays save

                // Don't forward this email to sender. Quarantine it
                emailAction = "false";
                suspiciousMsg = "ERROR: This email has been flagged as a spam\n\n";
            } else if (mailScore.compareTo(new BigDecimal(1.0).subtract(new BigDecimal(suspiciousThreshold))) == -1) {
                mail.setEmailCondition(EmailCondition.SUSPICIOUS);
                mail.setIteratedEmailCondition(EmailCondition.SUSPICIOUS);
                emailService.save(mail); // this updates, so stays save

                // Forward this email to receiver
                emailAction = "false";
                // TODO: Edit the body to flag the message as suspicious
                suspiciousMsg = "WARNING: This email has been flagged as suspicious\n\n";
            } else {
                // Safe email. Forward as normal
                emailService.save(mail); // this updates, so stays save
                emailAction = "false";
            }

//            mail.setEmailRuleMatchList(null);
//            mail.setAttachments(null);
            System.out.println("==========    NEW MAIL    ==========");
            System.out.println(mail.toString());
            System.out.println("===================================");



            ProcessBuilder processBuilder = new ProcessBuilder("python", resolvePythonScriptPath("api.py"), EmailMessage.bind(es, item.getId(),
                    new PropertySet(EmailMessageSchema.InternetMessageId)).getInternetMessageId(), emailAction, suspiciousMsg);
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();
            List<String> results = readProcessOutput(process.getInputStream());
            System.out.println(results.stream().collect(Collectors.joining("\n")));
        } catch (Exception e) {
            // log and keep going
            e.printStackTrace();
            System.out.println(e.getMessage());
        }

    }
}

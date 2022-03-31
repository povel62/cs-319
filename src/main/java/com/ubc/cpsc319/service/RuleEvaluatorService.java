package com.ubc.cpsc319.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ubc.cpsc319.entity.Attachment;
import com.ubc.cpsc319.entity.Email;
import com.ubc.cpsc319.entity.Rule;
import com.ubc.cpsc319.evaluation.RuleEvalStruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class RuleEvaluatorService {

    private Set<String> fromEmailAddrCache;
    private Set<String> blacklist;
    private boolean blacklistWorking;
    private final String blacklistFilepath = "./src/main/java/com/ubc/cpsc319/evaluation/Blacklist.txt";

    @Autowired
    CacheService cacheService;

    @Autowired
    EmailService emailService;

    public static Boolean isCacheInit = false;

    public RuleEvaluatorService() {
        this.fromEmailAddrCache = new HashSet<>();
        this.blacklist = new HashSet<>();
        this.blacklistWorking = true;
    }

    public void initService() {
        if (!isCacheInit) {
            synchronized (isCacheInit) {
                if (!isCacheInit) {
                    try {
                        cacheService.initCache();
                        List<Email> emails = emailService.findAll();
                        for (Email email : emails) {
                            String address = email.getFromAddress();
                            if(!address.contains("<")) {
                                continue;
                            }
                            String emailAdd = address.substring(address.indexOf('<')+1, address.indexOf('>'));
                            fromEmailAddrCache.add(emailAdd);
                        }
                    } catch (JsonProcessingException e) {
                        e.printStackTrace();
                    }

                    // create blacklist set
                    try (FileReader f = new FileReader(blacklistFilepath)) {
                        StringBuffer sb = new StringBuffer();
                        while (f.ready()) {
                            char c = (char) f.read();
                            if (c == '\n') {
                                blacklist.add(sb.toString());
                                sb = new StringBuffer();
                            } else {
                                sb.append(c);
                            }
                        }
                        if (sb.length() > 0) {
                            blacklist.add(sb.toString());
                        }
                    } catch(FileNotFoundException e) {
                        System.out.println(e.getMessage());
                        this.blacklistWorking = false;
                    } catch(IOException e) {
                        System.out.println(e.getMessage());
                        this.blacklistWorking = false;
                    }
                    isCacheInit = true;
                }
            }
        }

    }

    public RuleEvalStruct isHit(Rule rule, Email mail, List<Attachment> attachmentList) {
        boolean isHit = false;
        try {
            switch (rule.getRuleType()) {
                case DOMAIN:
                    isHit = evaluateDomainRule(rule, mail, attachmentList);
                    break;
                case KEYWORD:
                    isHit = evaluateKeywordRule(rule, mail, attachmentList);
                    break;
                case SIZE:
                    isHit = evaluateSizeRule(rule, mail, attachmentList);
                    break;
                case NO_OF_ATTACHMENTS:
                    isHit = evaluateNumberOfAttachmentsRule(rule, mail, attachmentList);
                    break;
                case FREQUENCY:
                    isHit = evaluateFrequency(rule, mail, attachmentList);
                    break;
                case ATTACHMENT_SIZE:
                    isHit = evaluateAttachmentSize(rule, mail, attachmentList);
                    break;
                case ATTACHMENT_NAME:
                    isHit = evaluateAttachmentName(rule, mail, attachmentList);
                    break;
                case USERNAME_ITERATION:
                    isHit = evaluateUsernameIterationRule(rule, mail, attachmentList);
                    break;
                case ASCII:
                    isHit = evaluateASCIIRule(rule, mail, attachmentList);
                    break;
                case BLACKLIST:
                    isHit = evaluateBlacklistRule(rule, mail, attachmentList);
                    break;
                default:
                    isHit = false;
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
        }

        // Update caches
        synchronized (this.fromEmailAddrCache) {
            String address = mail.getFromAddress();
            String email = address.substring(address.indexOf('<')+1, address.indexOf('>'));
            fromEmailAddrCache.add(email);
        }
        
        return new RuleEvalStruct(isHit, rule, mail);
    }

    private boolean evaluateDomainRule(Rule rule, Email mail, List<Attachment> attachmentList) {
        return mail.getFromAddress().toLowerCase().contains(rule.getName().toLowerCase());
    }

    private boolean evaluateKeywordRule(Rule rule, Email mail, List<Attachment> attachmentList) {
        return mail.getFromAddress().toLowerCase().contains(rule.getName().toLowerCase()) ||
                mail.getToAddress().toLowerCase().contains(rule.getName().toLowerCase()) ||
                mail.getBody().toLowerCase().contains(rule.getName().toLowerCase()) ||
                mail.getSubject().toLowerCase().contains(rule.getName().toLowerCase());
    }

    private boolean evaluateSizeRule(Rule rule, Email mail, List<Attachment> attachmentList) {
        return mail.getSize() > Integer.parseInt(rule.getName());
    }

    private boolean evaluateNumberOfAttachmentsRule(Rule rule, Email mail, List<Attachment> attachmentList) {
        return attachmentList.size() > Integer.parseInt(rule.getName());
    }

    private boolean evaluateFrequency(Rule rule, Email mail, List<Attachment> attachmentList) {
        return mail.getBody().toLowerCase().split(rule.getName().toLowerCase()).length
                > Integer.parseInt(rule.getParameter());
    }

    private boolean evaluateAttachmentSize(Rule rule, Email mail, List<Attachment> attachmentList) {
        for (Attachment at : attachmentList) {
            if (at.getSize() > Integer.parseInt(rule.getName())) {
                return true;
            }
        }
        return false;
    }

    private boolean evaluateAttachmentName(Rule rule, Email mail, List<Attachment> attachmentList) {
        for (Attachment at : attachmentList) {
            if (at.getName().toLowerCase().contains(rule.getName().toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    private boolean evaluateUsernameIterationRule(Rule rule, Email mail, List<Attachment> attachmentList) {
        String address = mail.getFromAddress();
        String email = address.substring(address.indexOf('<')+1, address.indexOf('>'));
        String username  = email.split("@", 2)[0];

        String[] usernameNumDelim = username.split("(?<=\\D)(?=\\d)|(?<=\\d)(?=\\D)");

        // Check if email contains numbers at the end
        int num;
        try {
            num = Integer.parseInt(usernameNumDelim[usernameNumDelim.length - 1]);
        } catch (NumberFormatException e) {
            // No numbers at the end
            return false;
        }

        for (String emailAddr: fromEmailAddrCache) {
            String tempUsername = emailAddr.split("@", 2)[0];

            String[] tempUsernameNumDelim = tempUsername.split("(?<=\\D)(?=\\d)|(?<=\\d)(?=\\D)");

            // Check if everything but the last split are the same
            boolean match = true;
            for (int i = 0; i < usernameNumDelim.length-1; i++) {
                try {
                    if (!usernameNumDelim[i].equals(tempUsernameNumDelim[i])) {
                        match = false;
                        break;
                    }
                } catch (ArrayIndexOutOfBoundsException e) {
                    match = false;
                    break;
                }
            }
            if (!match) {
                continue;
            }

            int tempNum;
            try {
                tempNum = Integer.parseInt(tempUsernameNumDelim[tempUsernameNumDelim.length - 1]);
            } catch (NumberFormatException e) {
                // No numbers at the end
                continue;
            }

            // Confirm that the usernames have different identifiers
            if (num != tempNum) {
                return true;
            }
        }

        return false;
    }

    private boolean evaluateASCIIRule(Rule rule, Email mail, List<Attachment> attachmentList) {
        // Doesn't pass regex than not ASCII
        String regex = "\\A\\p{ASCII}*\\z";

        return !(mail.getFromAddress().toLowerCase().matches(regex) &&
                mail.getToAddress().toLowerCase().matches(regex) &&
                mail.getBody().toLowerCase().matches(regex) &&
                mail.getSubject().toLowerCase().matches(regex));
    }

    private boolean evaluateBlacklistRule(Rule rule, Email mail, List<Attachment> attachmentList) {
        if (!blacklistWorking) {
            return false;
        }

        String address = mail.getFromAddress();
        String email = address.substring(address.indexOf('<')+1, address.indexOf('>'));
        String domain  = email.split("@", 2)[1];

        return blacklist.contains(domain);
    }
}


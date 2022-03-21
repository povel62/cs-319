package com.ubc.cpsc319.evaluation;

import com.ubc.cpsc319.entity.Attachment;
import com.ubc.cpsc319.entity.Email;
import com.ubc.cpsc319.entity.Rule;

import java.util.List;

public class RuleEvaluator {

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
                default:
                    isHit = false;
                    break;
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
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
}


package com.ubc.cpsc319.service;

import com.ubc.cpsc319.entity.Attachment;
import com.ubc.cpsc319.entity.Email;
import com.ubc.cpsc319.entity.EmailRuleMatch;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface EmailRuleMatchService extends AbstractService<EmailRuleMatch> {
    List<Long> deleteByEmail(Email email);
    EmailRuleMatch createEntityIfNotExisting(EmailRuleMatch emailRuleMatch);
}

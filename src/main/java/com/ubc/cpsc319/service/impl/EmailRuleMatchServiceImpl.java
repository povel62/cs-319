package com.ubc.cpsc319.service.impl;

import com.ubc.cpsc319.entity.Attachment;
import com.ubc.cpsc319.entity.Email;
import com.ubc.cpsc319.entity.EmailRuleMatch;
import com.ubc.cpsc319.entity.Rule;
import com.ubc.cpsc319.repository.EmailRuleMatchRepository;
import com.ubc.cpsc319.service.EmailRuleMatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailRuleMatchServiceImpl implements EmailRuleMatchService {

    @Autowired
    EmailRuleMatchRepository emailRuleMatchRepository;

    @SuppressWarnings("rawtypes")
    @Override
    public CrudRepository getRepository() {
        return emailRuleMatchRepository;
    }

    public List<Long> deleteByEmail(Email email) {
        return emailRuleMatchRepository.deleteByEmail(email);
    }

    public EmailRuleMatch createEntityIfNotExisting(EmailRuleMatch emailRuleMatch)
    {
        synchronized (EmailRuleMatchServiceImpl.class)
        {
            EmailRuleMatch mailRuleMatch = emailRuleMatchRepository.findByEmailIdAndRuleId(emailRuleMatch.getEmail().getId(),
                    emailRuleMatch.getRule().getId());
            if (mailRuleMatch == null)
            {
                mailRuleMatch = emailRuleMatchRepository.save(emailRuleMatch);
            }
            return mailRuleMatch;
        }
    }
}

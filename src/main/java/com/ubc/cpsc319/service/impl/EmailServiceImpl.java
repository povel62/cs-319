package com.ubc.cpsc319.service.impl;

import com.ubc.cpsc319.entity.Email;
import com.ubc.cpsc319.repository.EmailRepository;
import com.ubc.cpsc319.service.CacheService;
import com.ubc.cpsc319.service.EmailService;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    EmailRepository emailRepository;

    @Autowired
    CacheService cacheService;

    @SuppressWarnings("rawtypes")
    @Override
    public CrudRepository getRepository()
    {
        return emailRepository;
    }

    @Cacheable(value = "emails")
    public List<Email> findAll() {
        return emailRepository.findAll();
    }

    @Transactional
    public Email save(Email email) {
        email = emailRepository.save(email);
        Hibernate.initialize(email.getAttachments());
        Hibernate.initialize(email.getEmailRuleMatchList());
        cacheService.updateCache(email, false);
        return email;
    }

    @Transactional
    public void delete(Email email) {
        emailRepository.delete(email);
        cacheService.updateCache(email, true);
    }

    @Transactional
    public Email createEntityIfNotExisting(Email email)
    {
        synchronized (EmailServiceImpl.class)
        {
            Email mail = emailRepository.findByFromAddressAndToAddressAndCcAddressAndBccAddressAndSubjectAndBodyAndDateTimeSent(email.getFromAddress(),
                    email.getToAddress(), email.getCcAddress(), email.getBccAddress(),
                    email.getSubject(), email.getBody(), email.getDateTimeSent());

            if (mail == null)
            {
                mail = emailRepository.save(email);
            }
            cacheService.updateCache(mail, false);
            return mail;
        }
    }
}

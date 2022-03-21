package com.ubc.cpsc319.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ubc.cpsc319.entity.Email;
import com.ubc.cpsc319.evaluation.RuleEvaluator;
import com.ubc.cpsc319.service.CacheService;

import com.ubc.cpsc319.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CacheServiceImpl implements CacheService {

    @Autowired
    EmailService emailService;

    public static Boolean isCacheInit = false;

    @CacheEvict(value = "emails", cacheResolver = "customCacheResolver")
    public void updateCache(Email email, boolean isDelete) {
        System.out.println("updating cache");
    }

    @CacheEvict(value = "emails")
    public void resetCache() {
        isCacheInit = false;
        System.out.println("Cache has been reset");
    }

    @Transactional
    public void initCache() throws JsonProcessingException {
        if (!isCacheInit) {
            synchronized (isCacheInit) {
                if (!isCacheInit) {
                    String s = new ObjectMapper().writeValueAsString(emailService.findAll());
                    isCacheInit = true;
                }
            }
        }
    }

    @Transactional
    public int getEmailCount() {
       return emailService.findAll().size();
    }

    public boolean isCacheInitRunning() {
        return isCacheInit;
    }

}

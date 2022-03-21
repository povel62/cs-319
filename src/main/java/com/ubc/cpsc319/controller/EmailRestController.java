package com.ubc.cpsc319.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ubc.cpsc319.entity.Email;
import com.ubc.cpsc319.entity.EmailCondition;
import com.ubc.cpsc319.service.CacheService;
import com.ubc.cpsc319.service.EmailRuleMatchService;
import com.ubc.cpsc319.service.EmailService;
import org.apache.commons.lang3.EnumUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = { "/api/email" })
@CrossOrigin
public class EmailRestController {

    @Autowired
    EmailService emailService;

    @Autowired
    CacheService cacheService;

    @Autowired
    EmailRuleMatchService emailRuleMatchService;

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public List<Email> findAll()
    {
        try {
            cacheService.initCache();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return emailService.findAll();
    }

    @RequestMapping(value="/count", method = RequestMethod.GET)
    public int getEmailCount() {
        try {
            cacheService.initCache();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return cacheService.getEmailCount();
    }

    @RequestMapping(value="/{id}/condition/{condition}", method = RequestMethod.POST)
    public ResponseEntity createUpdate(@PathVariable(value = "id") Long id, @PathVariable(value = "condition") String condition) {
        Email email = emailService.find(id);
        if(email == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email with specified id doesn't exist.");
        }
        if(EnumUtils.isValidEnum(EmailCondition.class, condition)) {
            email.setIteratedEmailCondition(EmailCondition.valueOf(condition));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email Condition specified doesn't exist.");
        }
        emailService.save(email);
        return ResponseEntity.ok(email);
    }

    @RequestMapping(value="/{id}", method = RequestMethod.DELETE)
    public ResponseEntity deleteRule(@PathVariable(value = "id") Long id) {
        Email email = emailService.find(id);
        if(email == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email with specified id doesn't exist.");
        }
        try {
            emailRuleMatchService.deleteByEmail(email);
            emailService.delete(email);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email cannot be deleted.");
        }
        return ResponseEntity.ok("Email has been deleted");
    }

    @RequestMapping(value="/cache/reset", method = RequestMethod.GET)
    public ResponseEntity cachReset() {
        cacheService.resetCache();
        return ResponseEntity.ok("Email Cache has been reset.");
    }
}

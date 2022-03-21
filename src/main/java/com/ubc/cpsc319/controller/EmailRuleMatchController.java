package com.ubc.cpsc319.controller;

import com.ubc.cpsc319.entity.Email;
import com.ubc.cpsc319.entity.EmailCondition;
import com.ubc.cpsc319.entity.EmailRuleMatch;
import com.ubc.cpsc319.service.EmailRuleMatchService;
import com.ubc.cpsc319.service.EmailService;
import org.apache.commons.lang3.EnumUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = { "/api/email-rule-match" })
@CrossOrigin
public class EmailRuleMatchController {

    @Autowired
    EmailRuleMatchService emailRuleMatchService;

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public List<EmailRuleMatch> findAll()
    {
        return emailRuleMatchService.findAll();
    }

}

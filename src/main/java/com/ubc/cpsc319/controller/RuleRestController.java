package com.ubc.cpsc319.controller;

import com.ubc.cpsc319.dto.RuleCreation;
import com.ubc.cpsc319.entity.Rule;
import com.ubc.cpsc319.entity.RuleType;
import com.ubc.cpsc319.service.RuleService;
import org.apache.commons.lang3.EnumUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = { "/api/rule" })
@CrossOrigin
public class RuleRestController {

    @Autowired
    RuleService ruleService;

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public List<Rule> findAll()
    {
        return ruleService.findAll();
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity createUpdate(@RequestBody RuleCreation ruleCreation) {
        Rule rule = new Rule();
        rule.setName(ruleCreation.getName());
        if(EnumUtils.isValidEnum(RuleType.class, ruleCreation.getRuleType())) {
            rule.setRuleType(RuleType.valueOf(ruleCreation.getRuleType()));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Rule Type specified doesn't exist.");
        }
        rule.setInactive(ruleCreation.isInactive());
        rule.setRiskLevel(ruleCreation.getRiskLevel());
        rule.setParameter(ruleCreation.getParameter());
        rule = ruleService.createEntityIfNotExisting(rule);
        return ResponseEntity.ok(rule);
    }

    @RequestMapping(value="/{id}/is-inactive/{isInactive}", method = RequestMethod.POST)
    public ResponseEntity updateRuleIsInactive(@PathVariable(value = "id") Long id, @PathVariable(value = "isInactive") String isInactive) {
        Rule rule = ruleService.find(id);
        if(rule == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Rule with specified id doesn't exist.");
        }
        try {
            Boolean isInactiveBool = Boolean.parseBoolean(isInactive);
            rule.setInactive(isInactiveBool);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email Condition is inactive flag invalid.");
        }
        ruleService.save(rule);
        return ResponseEntity.ok(rule);
    }

    @RequestMapping(value="/{id}", method = RequestMethod.DELETE)
    public ResponseEntity deleteRule(@PathVariable(value = "id") Long id) {
        Rule rule = ruleService.find(id);
        if(rule == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Rule with specified id doesn't exist.");
        }
        try {
           ruleService.delete(rule);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Rule cannot be deleted.");
        }
        return ResponseEntity.ok("Rule has been deleted");
    }
}

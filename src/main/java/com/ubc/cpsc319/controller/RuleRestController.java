package com.ubc.cpsc319.controller;

import com.ubc.cpsc319.dto.RiskLevel;
import com.ubc.cpsc319.dto.RuleCreation;
import com.ubc.cpsc319.entity.Rule;
import com.ubc.cpsc319.entity.RuleType;
import com.ubc.cpsc319.service.RuleService;
import org.apache.commons.lang3.EnumUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = {"/api/rule"})
@CrossOrigin
public class RuleRestController {

    @Autowired
    RuleService ruleService;

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public List<Rule> findAll() {
        return ruleService.findAll();
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity createUpdate(@RequestBody RuleCreation ruleCreation) {
        if (EnumUtils.isValidEnum(RuleType.class, ruleCreation.getRuleType())) {
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Rule Type specified doesn't exist.");
        }
        Rule rule = ruleService.findByNameAndParameterAndRuleType(ruleCreation.getName(),
                ruleCreation.getParameter(), RuleType.valueOf(ruleCreation.getRuleType()));
        if(rule == null) {
            rule = new Rule();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Rule with same name, parameter and type already exists.");
        }
        rule.setName(ruleCreation.getName());
        rule.setRuleType(RuleType.valueOf(ruleCreation.getRuleType()));
        rule.setInactive(ruleCreation.isInactive());
        rule.setRiskLevel(ruleCreation.getRiskLevel());
        rule.setParameter(ruleCreation.getParameter());
        rule = ruleService.createEntityIfNotExisting(rule);
        return ResponseEntity.ok(rule);
    }

    @RequestMapping(value = "/{id}/is-inactive/{isInactive}", method = RequestMethod.POST)
    public ResponseEntity updateRuleIsInactive(@PathVariable(value = "id") Long id, @PathVariable(value = "isInactive") String isInactive) {
        Rule rule = ruleService.find(id);
        if (rule == null) {
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

    @RequestMapping(value = "/{id}/risk-level", method = RequestMethod.POST)
    public ResponseEntity updateRuleRiskLevel(@PathVariable(value = "id") Long id, @RequestBody RiskLevel riskLevel) {
        Rule rule = ruleService.find(id);
        if (rule == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Rule with specified id doesn't exist.");
        }
        try {
            rule.setRiskLevel(riskLevel.getRiskLevel());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Risk Level is not in a correct format.");
        }
        ruleService.save(rule);
        return ResponseEntity.ok(rule);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity deleteRule(@PathVariable(value = "id") Long id) {
        Rule rule = ruleService.find(id);
        if (rule == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Rule with specified id doesn't exist.");
        }
        try {
            if(rule.getRuleType() == RuleType.USERNAME_ITERATION
                    || rule.getRuleType() == RuleType.ASCII) {
                throw new Exception();
            }
            ruleService.delete(rule);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Rule cannot be deleted.");
        }
        return ResponseEntity.ok("Rule has been deleted");
    }

    @RequestMapping(value = "/types", method = RequestMethod.GET)
    public ResponseEntity  getRuleTypes() {
        List<HashMap<String, String>> array = new ArrayList<>();
        for (RuleType rule : RuleType.values()) {
            HashMap<String, String> map = new HashMap<>();
            map.put("name", rule.name());
            map.put("description", rule.getDescription());
            array.add(map);
        }
        return ResponseEntity.ok(array);
    }
}

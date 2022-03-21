package com.ubc.cpsc319.service;

import com.ubc.cpsc319.entity.Rule;
import com.ubc.cpsc319.entity.RuleType;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RuleService extends AbstractService<Rule> {
    List<Rule> getRuleByRuleTypeAndIsInactiveFalse(RuleType ruleType);
    List<Rule> findByIsInactiveFalse();
    Rule createEntityIfNotExisting(Rule rule);
    void delete(Rule rule);
}

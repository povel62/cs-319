package com.ubc.cpsc319.service.impl;

import com.ubc.cpsc319.entity.Rule;
import com.ubc.cpsc319.entity.RuleType;
import com.ubc.cpsc319.repository.RuleRepository;
import com.ubc.cpsc319.service.RuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RuleServiceImpl implements RuleService {

    @Autowired
    RuleRepository ruleRepository;

    @SuppressWarnings("rawtypes")
    @Override
    public CrudRepository getRepository()
    {
        return ruleRepository;
    }

    public List<Rule> getRuleByRuleTypeAndIsInactiveFalse(RuleType ruleType) {
        return ruleRepository.getRuleByRuleTypeAndIsInactiveFalse(ruleType);
    }

    public Rule createEntityIfNotExisting(Rule rule)
    {
        synchronized (RuleServiceImpl.class)
        {
            Rule ruleRepo = ruleRepository.findByNameAndParameterAndRuleType(rule.getName(),
                    rule.getParameter(), rule.getRuleType());
            if (ruleRepo == null)
            {
                ruleRepo = ruleRepository.save(rule);
            }
            return ruleRepo;
        }
    }

    public void delete(Rule rule) {
        ruleRepository.delete(rule);
    }

    public List<Rule> findByIsInactiveFalse() {
        return ruleRepository.findByIsInactiveFalse();
    }

    public List<Rule> findAll() {
        return ruleRepository.findAll();
    }
}

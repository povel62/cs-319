package com.ubc.cpsc319.repository;

import com.ubc.cpsc319.entity.Rule;
import com.ubc.cpsc319.entity.RuleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RuleRepository extends JpaRepository<Rule, Integer>, JpaSpecificationExecutor<Rule> {
    List<Rule> getRuleByRuleTypeAndIsInactiveFalse(RuleType ruleType);
    List<Rule> findByIsInactiveFalse();
    Rule findByNameAndParameterAndRuleType(String name, String parameter, RuleType ruleType);
}

package com.ubc.cpsc319.evaluation;

import com.ubc.cpsc319.entity.Email;
import com.ubc.cpsc319.entity.Rule;

public class RuleEvalStruct {
    public Boolean isHit;
    public Rule rule;
    public Email mail;

    public RuleEvalStruct(boolean isHit, Rule rule, Email mail) {
        this.isHit = isHit;
        this.rule = rule;
        this.mail = mail;
    }

}

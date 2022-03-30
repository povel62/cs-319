package com.ubc.cpsc319.dto;

public class RuleCreation {
    private String name;
    private String parameter;
    private String ruleType;
    private double riskLevel;
    private boolean isInactive;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getParameter() {
        return parameter;
    }

    public void setParameter(String parameter) {
        this.parameter = parameter;
    }

    public double getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(double riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getRuleType() {
        return ruleType;
    }

    public void setRuleType(String ruleType) {
        this.ruleType = ruleType;
    }

    public boolean isInactive() {
        return isInactive;
    }
    public void setIsInactive(boolean isInactive) {
        this.isInactive = isInactive;
    }
}

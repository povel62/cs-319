package com.ubc.cpsc319.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "rule", uniqueConstraints = @UniqueConstraint(columnNames = { "name", "ruleType", "parameter" }))
@NamedQuery(name = "Rule.findAll", query = "SELECT u FROM Rule u")
public class Rule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String parameter = "";

    @Column(columnDefinition = "bit default 0")
    private boolean isInactive = false;

    private double riskLevel;

    @CreationTimestamp
    private Date createdOn;

    @UpdateTimestamp
    private Date updatedOn;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RuleType ruleType;

    @JsonIgnore
    @OneToMany(mappedBy = "rule")
    private List<EmailRuleMatch> emailRuleMatchList;

    public Long getId()
    {
        return this.id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public String getName()
    {
        return this.name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public String getParameter() {
        return parameter == null ? "" : parameter;
    }

    public void setParameter(String parameter) {
        this.parameter = parameter;
    }

    public int getNumberOfMatchesTriggered() {
        return emailRuleMatchList == null ? 0 : emailRuleMatchList.size();
    }

    public List<EmailRuleMatch> getEmailRuleMatchList() {
        return emailRuleMatchList;
    }

    public void setEmailRuleMatchList(List<EmailRuleMatch> emailRuleMatchList) {
        this.emailRuleMatchList = emailRuleMatchList;
    }

    public boolean isInactive() {
        return isInactive;
    }

    public void setInactive(boolean inactive) {
        isInactive = inactive;
    }

    public Date getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(Date createdOn) {
        this.createdOn = createdOn;
    }

    public Date getUpdatedOn() {
        return updatedOn;
    }

    public void setUpdatedOn(Date updatedOn) {
        this.updatedOn = updatedOn;
    }

    public RuleType getRuleType() {
        return ruleType;
    }

    public void setRuleType(RuleType ruleType) {
        this.ruleType = ruleType;
    }

    public double getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(double riskLevel) {
        this.riskLevel = riskLevel;
    }

    @Override
    public boolean equals(Object obj)
    {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        return getId() == ((Rule) obj).getId();
    }

    @Override
    public String toString()
    {
        return "Rule [id=" + id + ", name=" + name + ", ruleType=" + ruleType == null ? "N/A" : ruleType.name()
                + ", riskLevel=" + riskLevel + ", isInactive=" + isInactive + "]";
    }
}

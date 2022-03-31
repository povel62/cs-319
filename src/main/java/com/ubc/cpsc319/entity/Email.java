package com.ubc.cpsc319.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.jsoup.Jsoup;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "email", uniqueConstraints = @UniqueConstraint(columnNames = {"subject", "body", "fromAddress", "toAddress", "ccAddress", "bccAddress", "dateTimeSent"}))
@NamedQuery(name = "Email.findAll", query = "SELECT u FROM Email u")
public class Email {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(nullable = false)
    private int size;

    @Column(nullable = false)
    private double score;

    @Column(nullable = false)
    private String fromAddress;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String toAddress;

    @Column(nullable = false)
    private Date dateTimeSent;

    @Column(columnDefinition = "TEXT")
    private String ccAddress = "";

    @Column(columnDefinition = "TEXT")
    private String bccAddress = "";

    @Column(nullable = false)
    private EmailCondition emailCondition = EmailCondition.OK;

    @Column(nullable = false)
    private EmailCondition iteratedEmailCondition = EmailCondition.OK;

    @JsonIgnore
    @OneToMany(mappedBy = "email")
    private List<EmailRuleMatch> emailRuleMatchList;

    @JsonIgnore
    @OneToMany(mappedBy = "email")
    private List<Attachment> attachments;

    @CreationTimestamp
    private Date createdOn;

    @UpdateTimestamp
    private Date updatedOn;

    public Date getDateTimeSent() {
        return dateTimeSent;
    }

    public void setDateTimeSent(Date dateTimeSent) {
        this.dateTimeSent = dateTimeSent;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCcAddress() {
        return ccAddress == null ? "" : ccAddress;
    }

    public void setCcAddress(String ccAddress) {
        this.ccAddress = ccAddress;
    }

    public String getBccAddress() {
        return bccAddress == null ? "" : bccAddress;
    }

    public void setBccAddress(String bccAddress) {
        this.bccAddress = bccAddress;
    }

    public int getSize() {
        return size;
    }

    public int getNumberOfAttachments() {
        return attachments == null ? 0 : attachments.size();
    }

    public List<Attachment> getAttachments() {
        return attachments == null ? new ArrayList<>() : attachments;
    }

    public void setAttachments(List<Attachment> attachments) {
        this.attachments = attachments;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public String getBodyTextOnly() {
        return body == null ? "" : Jsoup.parse(body).text().trim();
    }


    public void setBody(String body) {
        this.body = body;
    }

    public String getFromAddress() {
        return fromAddress;
    }

    public void setFromAddress(String fromAddress) {
        this.fromAddress = fromAddress;
    }

    public String getToAddress() {
        return toAddress;
    }

    public void setToAddress(String toAddress) {
        this.toAddress = toAddress;
    }

    public EmailCondition getEmailCondition() {
        return emailCondition;
    }

    public void setEmailCondition(EmailCondition emailCondition) {
        this.emailCondition = emailCondition;
    }

    public EmailCondition getIteratedEmailCondition() {
        return iteratedEmailCondition;
    }

    public void setIteratedEmailCondition(EmailCondition iteratedEmailCondition) {
        this.iteratedEmailCondition = iteratedEmailCondition;
    }

    public List<String> getEmailRuleMatches() {
        List<String> emptyStringList = new ArrayList<>();
        return emailRuleMatchList == null ? emptyStringList
                : emailRuleMatchList.stream().map(x -> x.getRule().getRuleType()
                        + (x.getRule().getParameter() != null && !x.getRule().getParameter().trim().isEmpty()
                        ? " (" + x.getRule().getParameter() + ")" : "")
                + ": " + x.getRule().getName()).collect(Collectors.toList());
    }

    public List<EmailRuleMatch> getEmailRuleMatchList() {
        return emailRuleMatchList == null ? new ArrayList<>() : emailRuleMatchList;
    }

    public void setEmailRuleMatchList(List<EmailRuleMatch> emailRuleMatchList) {
        this.emailRuleMatchList = emailRuleMatchList;
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

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        return getId() == ((Email) obj).getId();
    }

    @Override
    public String toString() {
        return "Email [id=" + id + ", from=" + fromAddress + ", to=" + toAddress + ", cc="
                + ccAddress + ", bcc=" + bccAddress + ", subject="
                + subject + ", body=" + body + ", condition=" + emailCondition.name()
                + ", iterated condition=" + iteratedEmailCondition.name() + ", score=" + score + "]";
    }
}

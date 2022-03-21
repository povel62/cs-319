package com.ubc.cpsc319.repository;

import com.ubc.cpsc319.entity.Email;
import com.ubc.cpsc319.entity.EmailRuleMatch;
import com.ubc.cpsc319.entity.Rule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmailRuleMatchRepository extends JpaRepository<EmailRuleMatch, Integer>, JpaSpecificationExecutor<EmailRuleMatch> {

    List<Long> deleteByEmail(Email email);
    EmailRuleMatch findByEmailIdAndRuleId(Long email, Long rule);
}

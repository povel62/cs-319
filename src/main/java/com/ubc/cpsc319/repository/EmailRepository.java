package com.ubc.cpsc319.repository;

import com.ubc.cpsc319.entity.Email;
import com.ubc.cpsc319.entity.Rule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface EmailRepository extends JpaRepository<Email, Integer>, JpaSpecificationExecutor<Email> {
    Email findByFromAddressAndToAddressAndCcAddressAndBccAddressAndSubjectAndBodyAndDateTimeSent(String fromAddress, String toAddress, String ccAddress, String bccAddress, String subject, String body, Date dateTimeSent);
}

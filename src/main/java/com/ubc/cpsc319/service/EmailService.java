package com.ubc.cpsc319.service;

import com.ubc.cpsc319.entity.Email;
import org.springframework.stereotype.Service;

@Service
public interface EmailService extends AbstractService<Email> {
    Email createEntityIfNotExisting(Email email);
    void delete(Email email);
    Email save(Email email);
}

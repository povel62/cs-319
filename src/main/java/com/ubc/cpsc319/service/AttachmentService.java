package com.ubc.cpsc319.service;

import com.ubc.cpsc319.entity.Attachment;
import com.ubc.cpsc319.entity.Email;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AttachmentService extends AbstractService<Attachment> {
    List<Attachment> findByEmail(Email email);
    Attachment createEntityIfNotExisting(Attachment attachment);

}

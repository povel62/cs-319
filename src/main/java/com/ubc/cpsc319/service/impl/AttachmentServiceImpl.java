package com.ubc.cpsc319.service.impl;

import com.ubc.cpsc319.entity.Attachment;
import com.ubc.cpsc319.entity.Email;
import com.ubc.cpsc319.entity.EmailRuleMatch;
import com.ubc.cpsc319.repository.AttachmentRepository;
import com.ubc.cpsc319.service.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttachmentServiceImpl implements AttachmentService {

    @Autowired
    AttachmentRepository attachmentRepository;

    @SuppressWarnings("rawtypes")
    @Override
    public CrudRepository getRepository()
    {
        return attachmentRepository;
    }

    public List<Attachment> findByEmail(Email email) {
        return attachmentRepository.findByEmail(email);
    }

    public Attachment createEntityIfNotExisting(Attachment attachment)
    {
        synchronized (AttachmentServiceImpl.class)
        {
            Attachment attach = attachmentRepository.findByNameAndEmail(attachment.getName(),
                    attachment.getEmail());
            if (attach == null)
            {
                attach = attachmentRepository.save(attachment);
            }
            return attach;
        }
    }

    public List<Attachment> findAll() {
        return attachmentRepository.findAll();
    }
}

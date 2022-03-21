package com.ubc.cpsc319.controller;

import com.ubc.cpsc319.entity.Attachment;
import com.ubc.cpsc319.entity.Email;
import com.ubc.cpsc319.service.AttachmentService;
import com.ubc.cpsc319.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = { "/api/attachment" })
@CrossOrigin
public class AttachmentRestController {

    @Autowired
    AttachmentService attachmentService;

    @Autowired
    EmailService emailService;

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public List<Attachment> findAll()
    {
        return attachmentService.findAll();
    }

    @RequestMapping(value="/email/{id}", method = RequestMethod.GET)
    public ResponseEntity getAttachmentsByEmail(@PathVariable(value = "id") Long id) {
        Email email = emailService.find(id);
        if(email == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email with specified id doesn't exist.");
        }
        List<Attachment> attachments = attachmentService.findByEmail(email);
        if(attachments.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Attachments with specified email id doesn't exist.");
        }
        return ResponseEntity.ok(attachments);
    }
}

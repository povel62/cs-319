package com.ubc.cpsc319.controller;

import com.ubc.cpsc319.dto.NameValue;
import com.ubc.cpsc319.entity.SystemConfig;
import com.ubc.cpsc319.service.SystemConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = { "/api/system-config" })
@CrossOrigin
public class SystemConfigRestController {

    @Autowired
    SystemConfigService systemConfigService;

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public List<SystemConfig> findAll()
    {
        return systemConfigService.findAll();
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity createUpdate(@RequestBody NameValue keyValue) {
        if(keyValue.getName().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Name should be non-empty.");
        }
        SystemConfig sysConfig = systemConfigService.createOrUpdateEntity(keyValue.getName(), keyValue.getValue());
        return ResponseEntity.ok(sysConfig);
    }
}

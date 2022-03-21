package com.ubc.cpsc319.service;

import com.ubc.cpsc319.entity.SystemConfig;
import org.springframework.stereotype.Service;

@Service
public interface SystemConfigService extends AbstractService<SystemConfig> {
    SystemConfig findByName(String key);
    SystemConfig createOrUpdateEntity(String key, String value);
}

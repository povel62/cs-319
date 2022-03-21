package com.ubc.cpsc319.service.impl;

import com.ubc.cpsc319.entity.SystemConfig;
import com.ubc.cpsc319.repository.SystemConfigRepository;
import com.ubc.cpsc319.service.SystemConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SystemConfigServiceImpl implements SystemConfigService {

    @Autowired
    SystemConfigRepository systemConfigRepository;

    @SuppressWarnings("rawtypes")
    @Override
    public CrudRepository getRepository()
    {
        return systemConfigRepository;
    }

    public SystemConfig findByName(String name) {
        return systemConfigRepository.findByName(name);
    }

    public SystemConfig createOrUpdateEntity(String name, String value) {
        synchronized (SystemConfigServiceImpl.class)
        {
            SystemConfig systemConfigRepo = systemConfigRepository.findByName(name);
            if (systemConfigRepo == null)
            {
                systemConfigRepo = new SystemConfig();
                systemConfigRepo.setName(name);
                systemConfigRepo.setValue(value);
                systemConfigRepo = systemConfigRepository.save(systemConfigRepo);
            } else {
                if(!systemConfigRepo.getValue().equalsIgnoreCase(value)) {
                    systemConfigRepo.setValue(value);
                    systemConfigRepo = systemConfigRepository.save(systemConfigRepo);
                }
            }
            return systemConfigRepo;
        }
    }

    public List<SystemConfig> findAll() {
        return systemConfigRepository.findAll();
    }
}

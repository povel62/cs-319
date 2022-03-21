package com.ubc.cpsc319.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ubc.cpsc319.entity.Email;
import org.springframework.stereotype.Service;

@Service
public interface CacheService {
    void updateCache(Email email, boolean isDelete);
    void resetCache();
    void initCache() throws JsonProcessingException;
    boolean isCacheInitRunning();
    int getEmailCount();
}

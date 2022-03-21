package com.ubc.cpsc319.service;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public interface PullService {

    @Async("processExecutor")
    void loop() throws Exception;

    boolean isServiceRunning();

    String start() throws Exception;

    String stop() throws Exception;
}

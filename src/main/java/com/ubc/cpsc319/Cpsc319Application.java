package com.ubc.cpsc319;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cache.annotation.EnableCaching;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.task.TaskExecutor;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;


@SpringBootApplication
@EntityScan({"com.ubc.cpsc319.entity"})
@ComponentScan({"com.ubc.cpsc319.service", "com.ubc.cpsc319.service.impl",
        "com.ubc.cpsc319.controller", "com.ubc.cpsc319.util",})
@EnableJpaRepositories("com.ubc.cpsc319.repository")
@EnableAsync
@EnableCaching
public class Cpsc319Application {

    @Bean(name="processExecutor")
    public TaskExecutor workExecutor() {
        ThreadPoolTaskExecutor threadPoolTaskExecutor = new ThreadPoolTaskExecutor();
        threadPoolTaskExecutor.setThreadNamePrefix("Async-");
        threadPoolTaskExecutor.setCorePoolSize(1);
        threadPoolTaskExecutor.setMaxPoolSize(1);
        threadPoolTaskExecutor.setQueueCapacity(1);
        threadPoolTaskExecutor.afterPropertiesSet();
        threadPoolTaskExecutor.initialize();
        return threadPoolTaskExecutor;
    }

    public static void main(String[] args) {
        SpringApplication.run(Cpsc319Application.class, args);
    }

}

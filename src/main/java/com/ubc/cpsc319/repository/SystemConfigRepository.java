package com.ubc.cpsc319.repository;

import com.ubc.cpsc319.entity.SystemConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemConfigRepository extends JpaRepository<SystemConfig, Integer>, JpaSpecificationExecutor<SystemConfig> {
    SystemConfig findByName(String name);
}

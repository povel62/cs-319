package com.ubc.cpsc319.entity;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "system_config")
@NamedQuery(name = "SystemConfig.findAll", query = "SELECT u FROM SystemConfig u")
public class SystemConfig {

    @Id
    @Column(unique = true, nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition="TEXT")
    private String value;

    @CreationTimestamp
    private Date createdOn;

    @UpdateTimestamp
    private Date updatedOn;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Date getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(Date createdOn) {
        this.createdOn = createdOn;
    }

    public Date getUpdatedOn() {
        return updatedOn;
    }

    public void setUpdatedOn(Date updatedOn) {
        this.updatedOn = updatedOn;
    }

    @Override
    public boolean equals(Object obj)
    {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        return getName().equalsIgnoreCase(((SystemConfig) obj).getName());
    }

    @Override
    public String toString()
    {
        return "System Configuration [name=" + name + ", value=" + value + "]";
    }
}

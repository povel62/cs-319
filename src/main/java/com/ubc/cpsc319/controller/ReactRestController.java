package com.ubc.cpsc319.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
public class ReactRestController {
    @RequestMapping({"/login/**", "/rules/**", "/quarantine/**", "/system-status/**"})
    public String forward(HttpServletRequest httpServletRequest) {
        return "forward:/";
    }
}

package com.upv_cal.upv_cal.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for home page and welcome message
 */
@Controller
public class HomeController {

    /**
     * Root endpoint that returns a welcome message
     * 
     * @return Welcome message
     */
    @GetMapping("/")
    @ResponseBody
    public Map<String, String> home() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Welcome to UPV Calendar API");
        response.put("status", "running");
        response.put("version", "1.0.0");
        return response;
    }
}
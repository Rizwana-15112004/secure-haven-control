package com.securehaven.control.controller;

import com.securehaven.control.model.Alert;
import com.securehaven.control.repository.AlertRepository;
import com.securehaven.control.service.BroadcastingService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    private final AlertRepository alertRepository;
    private final BroadcastingService broadcastingService;

    public AlertController(AlertRepository alertRepository, BroadcastingService broadcastingService) {
        this.alertRepository = alertRepository;
        this.broadcastingService = broadcastingService;
    }

    @GetMapping(value = "/events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        broadcastingService.addEmitter(emitter);
        return emitter;
    }

    @PostMapping("/send-alert")
    public Alert sendAlert(@RequestBody Alert alert) {
        Alert savedAlert = alertRepository.save(alert);
        broadcastingService.broadcast("alert", savedAlert);
        return savedAlert;
    }

    @PostMapping("/broadcast-proximity")
    public Map<String, Object> broadcastProximity(@RequestBody Map<String, Object> payload) {
        broadcastingService.broadcast("proximity-alert", payload);
        
        Integer radius = (Integer) payload.get("radius");
        boolean isSmallRadius = radius != null && radius <= 10;
        
        // Mock stats for demo purposes 
        return Map.of(
            "status", "success",
            "message", "Proximity alert broadcasted successfully",
            "smsSent", isSmallRadius ? 8 : 142,
            "emailsSent", isSmallRadius ? 5 : 285,
            "appUsers", broadcastingService.getClientCount(),
            "radius", isSmallRadius ? "5m" : "2km",
            "simulation", true
        );
    }
    
    @GetMapping
    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }
}

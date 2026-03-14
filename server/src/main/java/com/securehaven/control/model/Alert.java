package com.securehaven.control.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Data
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    private String type = "EMERGENCY";
    private String severity = "HIGH";
    private Double latitude;
    private Double longitude;

    @ManyToOne
    @JoinColumn(name = "triggered_by")
    private User triggeredBy;

    private LocalDateTime createdAt = LocalDateTime.now();
}

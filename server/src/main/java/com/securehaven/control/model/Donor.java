package com.securehaven.control.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "donors")
@Data
public class Donor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String bloodType;

    private LocalDate lastDonationDate;
    private String contactNumber;
    private String location;
    private boolean isEligible = true;
    private LocalDateTime createdAt = LocalDateTime.now();
}

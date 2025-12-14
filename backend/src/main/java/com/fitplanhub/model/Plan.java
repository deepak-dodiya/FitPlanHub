package com.fitplanhub.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Plan {
    private Long id;
    private Long trainerId;
    private String title;
    private String description;
    private Double price;
    private Integer durationDays;
    private LocalDateTime createdAt;

    // Additional fields for display
    private String trainerName;
    private boolean isSubscribed; // New field for frontend state
}

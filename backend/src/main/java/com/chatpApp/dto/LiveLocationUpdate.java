package com.chatpApp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LiveLocationUpdate {
    private Long userId;
    private String username;
    private double latitude;
    private double longitude;
}

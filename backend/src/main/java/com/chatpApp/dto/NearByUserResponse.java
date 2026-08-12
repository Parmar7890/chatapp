package com.chatpApp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class NearByUserResponse {
    private Long id;
    private String username;
    private double distanceInMeters;
}

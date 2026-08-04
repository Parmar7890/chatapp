package com.chatpApp.dto;

import com.chatpApp.entity.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@Builder
public class RegisterResponse {

    private Long id;
    private String username;
    private String email;
    private LocalDate dob;
    private Gender gender;
}


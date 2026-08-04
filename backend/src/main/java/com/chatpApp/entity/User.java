package com.chatpApp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;



@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    @Column(nullable = true)
    private String password;

    @Column(nullable = true)
    private LocalDate dob;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private com.chatpApp.entity.Gender gender;


}
package com.chatpApp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.awt.*;
import java.time.LocalDate;
import java.time.LocalDateTime;


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

    @Column(columnDefinition = "geography(Point,4326)")
    private Point location;

    private LocalDateTime localDateTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private com.chatpApp.entity.Gender gender;

    @Column(nullable = true)
    private String imgUrl;

}
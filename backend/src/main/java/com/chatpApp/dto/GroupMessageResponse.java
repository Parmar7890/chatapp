package com.chatpApp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class GroupMessageResponse {

    private Long id;
    private String geohash;
    private Long senderId;
    private String senderUsername;
    private String content;
    private LocalDateTime timestamp;
}

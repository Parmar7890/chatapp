package com.chatpApp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class MessageResponse {
    private Long id;
    private Long senderId;
    private Long receiverId;
    private String content;
    private boolean isDeleted;
    private LocalDateTime timestamp;

//    public MessageResponse(Long id, Long senderId, Long receiverId, String content, LocalDateTime timestamp) {
//        this.id = id;
//        this.senderId = senderId;
//        this.receiverId = receiverId;
//        this.content = content;
//        this.timestamp = timestamp;
//    }

}

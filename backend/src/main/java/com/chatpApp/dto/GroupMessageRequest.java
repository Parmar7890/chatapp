package com.chatpApp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupMessageRequest {
    private String geohash;
    private Long senderId;
    private String content;
}

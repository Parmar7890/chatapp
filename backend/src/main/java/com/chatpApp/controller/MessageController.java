package com.chatpApp.controller;


import com.chatpApp.dto.MessageResponse;
import com.chatpApp.service.MessageService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/{user1}/{user2}")
    public List<MessageResponse> getConversation(@PathVariable Long user1, @PathVariable Long user2) {

        return messageService.getConversation(user1, user2);
    }
}

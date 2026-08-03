package com.chatpApp.controller;

import com.chatpApp.dto.MessageRequest;
import com.chatpApp.dto.MessageResponse;
import com.chatpApp.service.MessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(MessageService messageService, SimpMessagingTemplate messagingTemplate) {
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(MessageRequest request) {
        MessageResponse saved = messageService.saveMessage(request);

        messagingTemplate.convertAndSend(
                "/queue/messages-" + request.getReceiverId(),
                saved
        );

        messagingTemplate.convertAndSend(
                "/queue/messages-" + request.getSenderId(),
                saved
        );
    }
}

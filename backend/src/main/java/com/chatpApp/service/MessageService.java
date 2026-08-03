package com.chatpApp.service;

import com.chatpApp.dto.MessageRequest;
import com.chatpApp.dto.MessageResponse;
import com.chatpApp.entity.Message;
import com.chatpApp.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public MessageResponse saveMessage(MessageRequest request) {
        Message message = new Message();
        message.setSenderId(request.getSenderId());
        message.setReceiverId(request.getReceiverId());
        message.setContent(request.getContent());
        message.setTimestamp(java.time.LocalDateTime.now());

        Message saved = messageRepository.save(message);

        return toResponse(saved);
    }

    public List<MessageResponse> getConversation(Long user1, Long user2) {
        return messageRepository.findConversation(user1, user2)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public MessageResponse toResponse(Message message) {
        return new MessageResponse(message.getId(), message.getSenderId(), message.getReceiverId(), message.getContent(), message.getTimestamp());
    }
}

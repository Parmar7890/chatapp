package com.chatpApp.service;

import com.chatpApp.dto.MessageRequest;
import com.chatpApp.dto.MessageResponse;
import com.chatpApp.entity.Message;
import com.chatpApp.exception.BadRequestException;
import com.chatpApp.repository.FriendRequestRepository;
import com.chatpApp.repository.MessageRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

    @Service
    public class MessageService {

        private final MessageRepository messageRepository;
        private final FriendRequestRepository friendRequestRepository;
        private final SimpMessagingTemplate messagingTemplate;

        public MessageService(MessageRepository messageRepository,
                              FriendRequestRepository friendRequestRepository,
                              SimpMessagingTemplate messagingTemplate) {
            this.messageRepository = messageRepository;
            this.friendRequestRepository = friendRequestRepository;
            this.messagingTemplate = messagingTemplate;
        }

        public MessageResponse saveMessage(MessageRequest request) {
            if(!friendRequestRepository.areFriends(request.getSenderId(), request.getReceiverId())) {
                throw new BadRequestException("You can only message friends");
            }

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


        public void deleteMessage(Long id) {
                   Message message = messageRepository.findById(id)
                           .orElseThrow(() -> new UsernameNotFoundException("Message not found"));

                    message.setDelete(true);
                    Message saved = messageRepository.save(message);
                    MessageResponse response = toResponse(saved);

            messagingTemplate.convertAndSend("/queue/messages-" + saved.getSenderId() + "-deleted", response);
            messagingTemplate.convertAndSend("/queue/messages-" + saved.getReceiverId() + "-deleted", response);
        }

        public MessageResponse toResponse(Message message) {
            return new MessageResponse(
                    message.getId(),
                    message.getSenderId(),
                    message.getReceiverId(),
                    message.getContent(),
                    message.isDelete(),
                    message.getTimestamp());
        }


    }

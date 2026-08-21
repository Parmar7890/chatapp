package com.chatpApp.service;

import com.chatpApp.dto.GroupMessageRequest;
import com.chatpApp.dto.GroupMessageResponse;
import com.chatpApp.entity.GroupMessage;
import com.chatpApp.entity.User;
import com.chatpApp.repository.GroupMessageRepository;
import com.chatpApp.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupMessageService {

    private final GroupMessageRepository groupMessageRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public GroupMessageService(GroupMessageRepository groupMessageRepository,
                               UserRepository userRepository,
                               SimpMessagingTemplate messagingTemplate) {
        this.groupMessageRepository = groupMessageRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public void sendGroupMessage(GroupMessageRequest request) {
        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if(!request.getGeohash().equals(sender.getCurrentGeohash())) {
            throw new IllegalArgumentException("You are not currenlty in the zone");
        }

        GroupMessage message = new GroupMessage();
        message.setGeohash(request.getGeohash());
        message.setSenderId(sender.getId());
        message.setSenderUsername(sender.getUsername());
        message.setContent(request.getContent());

        GroupMessage saved = groupMessageRepository.save(message);
        GroupMessageResponse response = toResponse(saved);

        messagingTemplate.convertAndSend("/topic/group-" + request.getGeohash(), response);
    }

    public List<GroupMessageResponse> getGroupHistory(String geohash) {
        return groupMessageRepository.findByGeohashOrderByTimestampAsc(geohash)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private GroupMessageResponse toResponse(GroupMessage m) {
        return new GroupMessageResponse(
                m.getId(), m.getGeohash(), m.getSenderId(),
                m.getSenderUsername(), m.getContent(), m.getTimestamp()
        );
    }
}

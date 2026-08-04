package com.chatpApp.service;

import com.chatpApp.dto.FriendRequestResponse;
import com.chatpApp.entity.FriendRequest;
import com.chatpApp.entity.User;
import com.chatpApp.exception.BadRequestException;
import com.chatpApp.exception.ConflictException;
import com.chatpApp.exception.ResourceNotFoundException;
import com.chatpApp.repository.FriendRequestRepository;
import com.chatpApp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FriendRequestService {
    private final FriendRequestRepository friendRequestRepository;
    private final UserRepository userRepository;

    public FriendRequestService(FriendRequestRepository friendRequestRepository, UserRepository userRepository) {
        this.friendRequestRepository = friendRequestRepository;
        this.userRepository = userRepository;
    }

    public FriendRequestResponse sendRequest(Long senderId, Long receiverId) {
        if(senderId.equals(receiverId)) {
            throw new BadRequestException("Cannot send request to yourself");
        }

        friendRequestRepository.findBetweenUsers(senderId, receiverId).ifPresent(existing -> {
            throw new ConflictException("Request alredy exists between these users");
        });

        FriendRequest request = new FriendRequest();
        request.setSenderId(senderId);
        request.setReceiverId(receiverId);

        FriendRequest saved = friendRequestRepository.save(request);
        return toResponse(saved);
    }

    public FriendRequestResponse respondToRequest(Long requestId, boolean accept) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Friend request not found"));

        request.setStatus(accept ? FriendRequest.RequestStatus.ACCEPTED
                : FriendRequest.RequestStatus.REJECTED);

        FriendRequest saved = friendRequestRepository.save(request);
        return toResponse(saved);
    }

    public List<FriendRequestResponse> getPendingRequests(Long userId) {
        return friendRequestRepository.findByReceiverIdStatus(userId, FriendRequest.RequestStatus.PENDING)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<FriendRequestResponse> getFriends(Long userId) {
        return friendRequestRepository.findAcceptedFriend(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private FriendRequestResponse toResponse(FriendRequest fr) {
        User sender = userRepository.findById(fr.getSenderId())
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));

        User receiver = userRepository.findById(fr.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("receiver not found"));

        return new FriendRequestResponse(
                fr.getId(),
                fr.getSenderId(),
                sender.getUsername(),
                fr.getReceiverId(),
                receiver.getUsername(),
                fr.getStatus().name(),
                fr.getCreatedAt()
        );
    }

}

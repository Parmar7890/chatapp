package com.chatpApp.controller;


import com.chatpApp.dto.FriendRequestResponse;
import com.chatpApp.service.FriendRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/friend-request")
public class FriendRequestController {

    private final FriendRequestService friendRequestService;

    public FriendRequestController(FriendRequestService friendRequestService) {
        this.friendRequestService = friendRequestService;
    }

    @PostMapping
    public FriendRequestResponse sendRequest(@RequestParam Long senderId, @RequestParam Long receiverId) {
        return friendRequestService.sendRequest(senderId, receiverId);
    }

    @PutMapping("/{requestId}/accept")
    public FriendRequestResponse acceptRequest(@PathVariable Long requestId) {
        System.out.print("reach:::controller");
        return friendRequestService.respondToRequest(requestId, true);
    }

    @PutMapping("/{requestId}/reject")
    public FriendRequestResponse rejectRequest(@PathVariable Long requestId) {
        return friendRequestService.respondToRequest(requestId, false);
    }

    @GetMapping("/pending/{userId}")
    public List<FriendRequestResponse> getPendingRequests(@PathVariable Long userId) {
        return friendRequestService.getPendingRequests(userId);
    }

    @GetMapping("/friends/{userId}")
    public List<FriendRequestResponse> getFriends(@PathVariable Long userId) {
        return friendRequestService.getFriends(userId);
    }


}

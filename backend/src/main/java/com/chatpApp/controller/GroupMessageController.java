package com.chatpApp.controller;

import com.chatpApp.dto.GroupMessageResponse;
import com.chatpApp.service.GroupMessageService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/group-messages")
public class GroupMessageController {

    private final GroupMessageService groupMessageService;

    public GroupMessageController(GroupMessageService groupMessageService) {
        this.groupMessageService = groupMessageService;
    }


    @GetMapping("/{geohash}")
    public List<GroupMessageResponse> getHistory(@PathVariable String geohash) {
        return groupMessageService.getGroupHistory(geohash);
    }
}

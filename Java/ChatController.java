package com.example.chatapp.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.example.chatapp.model.ChatMessage;

@Controller
public class ChatController {

    // 例：クライアント → /app/chat.send
    @MessageMapping("/chat.send")
    @SendTo("/topic/public")
    public ChatMessage send(ChatMessage message) {
        message.setTime(java.time.LocalTime.now().toString());
        return message;
    }
}

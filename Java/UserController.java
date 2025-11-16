package com.example.chatapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.chatapp.entity.User;
import com.example.chatapp.repository.UserRepository;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // JSON形式のデータを受け取りDBに登録
    @PostMapping("/createprofile") 
    public ResponseEntity<String> createProfile(@RequestBody User user) {
        // 重複チェック
        User exists = userRepository.findByUsername(user.getUsername());
        if (exists != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("exists");
        }
        // 登録
        userRepository.save(user);
        return ResponseEntity.ok("success");
    }
    
    //  ログインAPI
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        User found = userRepository.findByUsername(user.getUsername());
        if (found == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("user not found");
        }

        if (!found.getPassword().equals(user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("wrong password");
        }

        return ResponseEntity.ok("success");
    }
    
}


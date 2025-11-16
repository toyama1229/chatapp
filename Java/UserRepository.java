package com.example.chatapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.chatapp.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // ユーザー名で検索する（ログイン用などで使用可能）
    User findByUsername(String username);
}

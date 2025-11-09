# 開発環境
Java:17
Spring Boot:3.5.6
mysql:8.0.43

#  データベース構成
このプロジェクトでは **MySQL** を使用しています。  
以下は主なテーブル構造です。

データベース名：chatapp

#  テーブル一覧

| テーブル名 | 説明 |
|-------------|------|
| `users` | ユーザー情報を管理 |
| `messages` | チャットメッセージを保存 |
| `rooms` | チャットルーム情報を管理 |

---

##  users テーブル

| カラム名 | 型 | NULL許可 | デフォルト | 主キー | 説明 |
|-----------|----|----------|-------------|---------|------|
| `id` | INT | NO | NULL | ✅ | auto_increment |
| `username` | VARCHAR(50) | NO | NULL |  | ユーザー名 |
| `password` | VARCHAR(50) | NO | NULL |  | パスワード |

---

##  room テーブル

| カラム名 | 型 | NULL許可 | デフォルト | 主キー | 説明 |
|-----------|----|----------|-------------|---------|------|
| `id` | INT | NO | NULL | ✅ | auto_increment |
| `sender_id` | INT | NO | NULL |  | 送信者ユーザーID |
| `receiver_id` | INT | NO | NULL |  | 受信者ユーザーID |
| `message` | TEXT | NO | NULL |  | メッセージ本文 |
| `created_at` | DATETIME | NO | NULL |  | 作成日時 |

---

##  message テーブル

| カラム名 | 型 | NULL許可 | デフォルト | 主キー | 説明 |
|-----------|----|----------|-------------|---------|------|
| `id` | INT | NO | NULL | ✅ | auto_increment |
| `name` | VARCHAR(50) | NO | NULL |  | 名前 |
| `created_at` | DATETIME | NO | NULL |  | 作成日時 |

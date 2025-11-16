package com.example.chatapp.model;

public class ChatMessage {
    private String from;
    private String text;
    private String group;
    private String time;

    // Getter/Setter
    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getGroup() { return group; }
    public void setGroup(String group) { this.group = group; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
}

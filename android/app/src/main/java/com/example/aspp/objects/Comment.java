package com.example.aspp.objects;

import java.io.Serializable;
import java.util.ArrayList;

public class Comment implements Serializable {
    int publisherId, videoId, id;
    String text;
    int likes;
    int dislikes;
    ArrayList<Comment> replayComments;

    public Comment(int publisherId, String text, int videoId, int id) {
        this.publisherId = publisherId;
        this.text = text;
        this.videoId = videoId;
        this.id = id;
        this.likes = 0;
        this.dislikes = 0;
        this.replayComments = new ArrayList<>();
    }
    public void addLike() {
        this.likes++;
    }
    public void subLike() {
        this.dislikes++;
    }
    public void addReplay(Comment replay) {
        this.replayComments.add(replay);
    }

    public ArrayList<Comment> getReplayComments() {
        return replayComments;
    }

    public int getPublisherId() {
        return publisherId;
    }

    public int getLikes() {
        return likes;
    }

    public int getDislikes() {
        return dislikes;
    }

    public String getText() {
        return this.text;
    }
    public int getVideoId() {
        return this.videoId;
    }

    public int getId() {
        return id;
    }
}

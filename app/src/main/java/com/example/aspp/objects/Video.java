package com.example.aspp.objects;

import android.icu.util.Calendar;
import android.net.Uri;

import java.util.ArrayList;
import java.util.Date;

public class Video {
//    private double duration;
    private String publisher, title, description, videoPath, tags;
    private int likes, dislikes, views, thumbnailDrawableId, id;
    private ArrayList<Comment> comments;
    private Date dateOfPublish;
    private Uri videoPathInRaw, thumbnailUri;

    private User myUser;

    public Video(int id, String publisher, double duration, String title, String description, String tags, int thumbnailDrawableId, Uri videoPathInRaw, User myUser) {
        this.id = id;
        this.publisher = publisher;
//        this.duration = duration;
        this.title = title;
        this.description = description;
        this.thumbnailDrawableId = thumbnailDrawableId;
        this.videoPathInRaw = videoPathInRaw;
        this.thumbnailUri = null;
        this.videoPath = null;
        this.tags = tags;
        this.likes = 0;
        this.dislikes = 0;
        this.views = 0;
        this.comments = new ArrayList<>();
        this.dateOfPublish = Calendar.getInstance().getTime();
        this.myUser = myUser;
    }

    public Video(int id, String publisher, double duration, String title, String description, String tags, int thumbnailDrawableId, String videoPath) {
//        this.duration = duration;
        this.id = id;
        this.publisher = publisher;
        this.title = title;
        this.description = description;
        this.videoPath = videoPath;
        this.thumbnailDrawableId = thumbnailDrawableId;
        this.thumbnailUri = null;
        this.videoPathInRaw = null;
        this.tags = tags;
        this.likes = 0;
        this.dislikes = 0;
        this.views = 0;
        this.comments = new ArrayList<>();
        this.dateOfPublish = Calendar.getInstance().getTime();
        this.myUser = null;
    }

    public Video(int id,String publisher, double duration, String title, String description, String tags, Uri thumbnailUri, String videoPath, User myUser) {
//        this.duration = duration;
        this.id = id;
        this.publisher = publisher;
        this.title = title;
        this.description = description;
        this.videoPath = videoPath;
        this.thumbnailUri = thumbnailUri;
        this.thumbnailDrawableId = 0;
        this.videoPathInRaw = null;
        this.tags = tags;
        this.likes = 0;
        this.dislikes = 0;
        this.views = 0;
        this.comments = new ArrayList<>();
        this.dateOfPublish = Calendar.getInstance().getTime();
        this.myUser = myUser;
    }
    public String getTags() {
        return tags;
    }

    public Uri getThumbnailUri() {
        return thumbnailUri;
    }

    public String getVideoPath() {
        return videoPath;
    }
    public String getVideoPathInRaw() {
        return String.valueOf(videoPathInRaw);
    }

    public int getThumbnailDrawableId() {
        return thumbnailDrawableId;
    }

    public String getPublisher() {
        return publisher;
    }

//    public double getDuration() {
//        return duration;
//    }

    public User getUser(){
        if(this.myUser != null){
            return null;
        }
        return this.myUser;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String newTitle){
        this.title = newTitle;
    }

    public void setDescription(String newTitle){
        this.description= newTitle;
    }

    public String getDescription() {
        return description;
    }

    public int getLikes() {
        return likes;
    }

    public int getDislikes() {
        return dislikes;
    }

    public int getViews() {
        return views;
    }

    public ArrayList<Comment> getComments() {
        return comments;
    }

    public Date getDateOfPublish() {
        return dateOfPublish;
    }

    public void addLike() {
        this.likes++;
    }

    public void subLike() {
        this.likes--;
    }

    public void addView() {
        this.views++;
    }
    public int getId() {
        return id;
    }
}

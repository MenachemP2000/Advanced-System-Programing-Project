package com.example.aspp.objects;

import android.graphics.Bitmap;


import java.util.ArrayList;
import java.util.Date;

public class User {

    private String username;

    private String fullName;

    private String password;
    private String id;
    private Date dateOfJoin;
    private ArrayList<User> subscribers;
    private ArrayList<Video> videos;
    private Bitmap profilePicture;
    private String profilePictureUrl;

    // Default constructor
    public User() {
        this.subscribers = new ArrayList<>();
        this.videos = new ArrayList<>();
        this.dateOfJoin = new Date(); // Defaults to current date/time
    }

    // Constructor with username and id
    public User(String username,String password, String fullName, String id) {
        this.username = username;
        this.id = id;
        this.fullName = fullName;
        this.password = password;
        this.subscribers = new ArrayList<>();
        this.videos = new ArrayList<>();
        this.dateOfJoin = new Date(); // Defaults to current date/time
    }

    // Getters and setters
    public String getUsername() {
        return username;
    }


    public String getId() {
        return id;
    }


    public Date getDateOfJoin() {
        return dateOfJoin;
    }


    public ArrayList<User> getSubscribers() {
        return subscribers;
    }

    public void setSubscribers(ArrayList<User> subscribers) {
        this.subscribers = subscribers;
    }

    public void addSubscriber(User subscriber) {
        this.subscribers.add(subscriber);
    }

    public ArrayList<Video> getVideos() {
        return videos;
    }

    public void setVideos(ArrayList<Video> videos) {
        this.videos = videos;
    }

    public void addVideo(Video video) {
        this.videos.add(video);
    }

    public Bitmap getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(Bitmap profilePicture) {
        this.profilePicture = profilePicture;
    }

    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", id='" + id + '\'' +
                ", dateOfJoin=" + dateOfJoin +
                ", subscribers=" + subscribers +
                ", videos=" + videos +
                '}';
    }

    public void setDateOfJoin(Date date) {
        this.dateOfJoin = date;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }


    public void setProfilePictureUrl(String profilePictureUri) {
        this.profilePictureUrl = profilePictureUri;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPassword() {
        return this.password;
    }
}

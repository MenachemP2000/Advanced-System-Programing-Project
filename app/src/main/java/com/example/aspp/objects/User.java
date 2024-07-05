package com.example.aspp.objects;


import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.Random;

public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    private String username;

    private String fullName;

    private String password;
    private String id;
    private Date dateOfJoin;
    private ArrayList<User> subscribers;
    private ArrayList<Video> videos;

    private String profilePictureUri;


    public User(String username,String password, String fullName, String url) {
        this.username = username;
        this.id = generateUniqueId();
        this.fullName = fullName;
        this.password = password;
        this.profilePictureUri = url;
        this.subscribers = new ArrayList<>();
        this.videos = new ArrayList<>();
        this.dateOfJoin = new Date(); // Defaults to current date/time
    }

    public User(String username,String password, String fullName, String url, String id) {
        this.username = username;
        this.id = id;
        this.fullName = fullName;
        this.password = password;
        this.profilePictureUri = url;
        this.subscribers = new ArrayList<>();
        this.videos = new ArrayList<>();
        this.dateOfJoin = new Date();
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

    public String getProfilePictureUri() {
        return profilePictureUri;
    }


    public void setProfilePictureUrl(String profilePictureUri) {
        this.profilePictureUri = profilePictureUri;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPassword() {
        return this.password;
    }

    private String generateUniqueId() {
        Random random = new Random();
        int randomNumber = random.nextInt(100000000);
        return String.format("%08d", randomNumber);
    }
}

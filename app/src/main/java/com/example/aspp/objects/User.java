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

    private ArrayList<Video> likedVideos;

    private ArrayList<Video> dislikedVideos;

    private ArrayList<Comment> comments;

    private ArrayList<Comment> likedComments;

    private ArrayList<Comment> dislikedComments;

    private String profilePictureUri;


    public User(String username, String password, String fullName, String url) {
        this.username = username;
        this.id = generateUniqueId();
        this.fullName = fullName;
        this.password = password;
        this.profilePictureUri = url;
        this.subscribers = new ArrayList<>();
        this.videos = new ArrayList<>();
        this.likedVideos = new ArrayList<>(); // Initialize likedVideos
        this.dislikedVideos = new ArrayList<>(); // Initialize dislikedVideos
        this.dateOfJoin = new Date(); // Defaults to current date/time
        this.comments = new ArrayList<>(); // Initialize comments
        this.likedComments = new ArrayList<>();
        this.dislikedComments = new ArrayList<>();
    }

    // Constructor with id
    public User(String username, String password, String fullName, String url, String id) {
        this.username = username;
        this.id = id;
        this.fullName = fullName;
        this.password = password;
        this.profilePictureUri = url;
        this.subscribers = new ArrayList<>();
        this.videos = new ArrayList<>();
        this.likedVideos = new ArrayList<>(); // Initialize likedVideos
        this.dislikedVideos = new ArrayList<>(); // Initialize dislikedVideos
        this.dateOfJoin = new Date(); // Defaults to current date/time
        this.comments = new ArrayList<>(); // Initialize comments
        this.likedComments = new ArrayList<>();
        this.dislikedComments = new ArrayList<>();
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
    public ArrayList<Comment>  getComments(){
        return this.comments;
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
    public void addLikedVideo(Video video) {
        if (video != null && !likedVideos.contains(video)) {
            likedVideos.add(video);
        }
    }

    public boolean isVideoLiked(Video video) {
        return video != null && likedVideos.contains(video);
    }

    public boolean isVideoDisliked(Video video) {
        return video != null && dislikedVideos.contains(video);
    }
    public void addDislikedVideo(Video video) {
        if (video != null && !dislikedVideos.contains(video)) {
            dislikedVideos.add(video);
        }
    }


    public void removeLikedVideo(Video currentVideo) {
        likedVideos.remove(currentVideo);
    }

    public void removeDislikedVideo(Video currentVideo) {
        dislikedVideos.remove(currentVideo);
    }

    public boolean hasVideo(Video currentVideo) {
        return videos.contains(currentVideo);
    }

    public void addComment(Comment newComment) {
        comments.add(newComment);
    }

    public ArrayList<Comment> getDislikedComments() {
        return dislikedComments;
    }

    public ArrayList<Comment> getLikedComments() {
        return likedComments;
    }
}

package com.example.aspp.objects;

import android.graphics.Bitmap;

import androidx.annotation.Nullable;

import java.time.LocalDateTime;
import java.util.ArrayList;

public class User {
    private String first_name, last_name;
    private LocalDateTime date_of_creation;
    private ArrayList <Video> published_videos;
    Bitmap profilePic;

    public User(String first_name, String last_name, LocalDateTime date_of_creation, @Nullable Bitmap profilePic) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.date_of_creation = date_of_creation;
        this.published_videos = new ArrayList<>();
        this.profilePic = profilePic;
    }

    public String getFirst_name() {
        return first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public ArrayList<Video> getPublished_surveys() {
        return published_videos;
    }

    public Bitmap getProfilePic() throws NullPointerException {
        //TODO
        return profilePic;
    }
}


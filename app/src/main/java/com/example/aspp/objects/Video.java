package com.example.aspp.objects;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.icu.util.Calendar;
import android.os.Build;

import androidx.appcompat.content.res.AppCompatResources;

import com.example.aspp.R;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;
import java.util.Map;

public class Video implements Serializable {
    private double duration;
    private String publisher, title, description;
    private int likes, dislikes, views, thumbnailDrawableId;
    private ArrayList<Comment> comments;
    private Date dateOfPublish;

    public Video(String publisher, double duration, String title, String description, int thumbnailDrawableId) {
        this.publisher = publisher;
        this.duration = duration;
        this.title = title;
        this.description = description;
        this.thumbnailDrawableId = thumbnailDrawableId;
        this.likes = 0;
        this.dislikes = 0;
        this.views = 0;
        this.comments = new ArrayList<>();
        this.dateOfPublish = Calendar.getInstance().getTime();
    }

    public int getThumbnailDrawableId() {
        return thumbnailDrawableId;
    }

    public String getPublisher() {
        return publisher;
    }

    public double getDuration() {
        return duration;
    }

    public String getTitle() {
        return title;
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
}

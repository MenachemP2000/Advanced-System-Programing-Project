package com.example.aspp.objects;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.icu.util.Calendar;
import android.net.Uri;
import android.os.Build;

import androidx.appcompat.content.res.AppCompatResources;

import com.example.aspp.R;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;
import java.util.Map;

public class Video {
//    private double duration;
    private String publisher, title, description, videoPath, tags;
    private int likes, dislikes, views, thumbnailDrawableId;
    private ArrayList<Comment> comments;
    private Date dateOfPublish;
    private Uri videoPathInRaw, thumbnailUri;
    public Video(String publisher, double duration, String title, String description, String tags, int thumbnailDrawableId, Uri videoPathInRaw) {
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
    }

    public Video(String publisher, double duration, String title, String description, String tags, int thumbnailDrawableId, String videoPath) {
//        this.duration = duration;
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
    }

    public Video(String publisher, double duration, String title, String description, String tags, Uri thumbnailUri, String videoPath) {
//        this.duration = duration;
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

    public void addLike() {
        this.likes++;
    }

    public void subLike() {
        this.likes--;
    }

    public void addView() {
        this.views++;
    }
}

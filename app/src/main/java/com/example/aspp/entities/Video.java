package com.example.aspp.entities;

import android.icu.util.Calendar;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Entity
public class Video {
     @Ignore private String[] tags;
@PrimaryKey @NonNull String _id;
    private String title, description, source, thumbnail, upload_date, username;
    private int likeCount, __v, views;
    @Ignore private List<Comment> comments;
    @Ignore private List<String> usersLikes;

    @Override
    public String toString() {
        return "Video{" +
                "tags=" + Arrays.toString(tags) +
                ", usersLikes=" + usersLikes +
                ", _id='" + _id + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", source='" + source + '\'' +
                ", thumbnail='" + thumbnail + '\'' +
                ", upload_date='" + upload_date + '\'' +
                ", username='" + username + '\'' +
                ", likeCount=" + likeCount +
                ", __v=" + __v +
                ", views=" + views +
                ", comments=" + comments +
                '}';
    }

    public Video() {
    }

    public Video(String[] tags, List<String> usersLikes, @NonNull String _id, String title, String description, String source, String thumbnail, String upload_date, String username, int likeCount, int __v, int views, List<Comment> comments) {
        this.tags = tags;
        this.usersLikes = usersLikes;
        this._id = _id;
        this.title = title;
        this.description = description;
        this.source = source;
        this.thumbnail = thumbnail;
        this.upload_date = upload_date;
        this.username = username;
        this.likeCount = likeCount;
        this.__v = __v;
        this.views = views;
        this.comments = comments;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public String[] getTags() {
        return tags;
    }

    public void setTags(String[] tags) {
        this.tags = tags;
    }

    public List<String> getUsersLikes() {
        return usersLikes;
    }

    public void setUsersLikes(List<String> usersLikes) {
        this.usersLikes = usersLikes;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getUpload_date() {
        String date = upload_date.substring(0,upload_date.indexOf("T"));
        String day = date.substring(date.lastIndexOf("-") + 1);
        String month = date.substring(date.indexOf("-") + 1, date.lastIndexOf("-"));
        String year = date.substring(0, date.indexOf("-"));
        date = day + "." + month + "." + year;
        return date;
    }

    public void setUpload_date(String upload_date) {
        this.upload_date = upload_date;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(int likeCount) {
        this.likeCount = likeCount;
    }

    public int get__v() {
        return __v;
    }

    public void set__v(int __v) {
        this.__v = __v;
    }

    public int getViews() {
        return views;
    }

    public void setViews(int views) {
        this.views = views;
    }
}

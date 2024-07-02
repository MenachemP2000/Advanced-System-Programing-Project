package com.example.aspp.entities;

import android.icu.util.Calendar;
import android.net.Uri;

import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Entity
public class Video {
    @Ignore private String[] usersLikes;
    @Ignore private Number viewsn;
    @Ignore private Comment[] commentsa;
    @Ignore private Number likeCount;
    @Ignore private String username;
    @Ignore private String duration;
    @Ignore private Date upload_date;
    @Ignore private String[] tagsr;
    @Ignore private String thumbnail;
    @Ignore private String source;
    //    private double duration;
    @PrimaryKey(autoGenerate = true) int id;
    private String publisher, title, description, videoPath, tag;
    private int likes, dislikes, views, thumbnailDrawableId;
    @Ignore private ArrayList<Comment> comments;
    @Ignore private Date dateOfPublish;
    @Ignore private Uri videoPathInRaw, thumbnailUri;
    @Ignore private List<String> tags;

    @Override
    public String toString() {
        return "Video{" +
                "usersLikes=" + Arrays.toString(usersLikes) +
                ", viewsn=" + viewsn +
                ", commentsa=" + Arrays.toString(commentsa) +
                ", likeCount=" + likeCount +
                ", username='" + username + '\'' +
                ", duration='" + duration + '\'' +
                ", upload_date=" + upload_date +
                ", tagsr=" + Arrays.toString(tagsr) +
                ", thumbnail='" + thumbnail + '\'' +
                ", source='" + source + '\'' +
                ", id=" + id +
                ", publisher='" + publisher + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", videoPath='" + videoPath + '\'' +
                ", tag='" + tag + '\'' +
                ", likes=" + likes +
                ", dislikes=" + dislikes +
                ", views=" + views +
                ", thumbnailDrawableId=" + thumbnailDrawableId +
                ", comments=" + comments +
                ", dateOfPublish=" + dateOfPublish +
                ", videoPathInRaw=" + videoPathInRaw +
                ", thumbnailUri=" + thumbnailUri +
                ", tags=" + tags +
                '}';
    }

    public String getSource() {
        return source;
    }

    // Getters and setters for tags
    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tag) {
        this.tags = tag;
    }
    public Video (String title, String description, String source, String thumbnail, String[] tags,
                  Date upload_date, String duration, String username, Number likeCount,
                  Number views, String[] usersLikes, Comment[] comments) {
        this.title = title;this.description = description;this.source = source;this.thumbnail = thumbnail;
        this.tagsr = tags;this.upload_date = upload_date;this.duration = duration;
        this.username = username;this.likeCount = likeCount;this.viewsn = views;this.usersLikes = usersLikes;
                this.commentsa = comments;
    }
    public Video(int id, String publisher, String title, String description, String tag, int thumbnailDrawableId, Uri videoPathInRaw) {
        this.id = id;
        this.publisher = publisher;
//        this.duration = duration;
        this.title = title;
        this.description = description;
        this.thumbnailDrawableId = thumbnailDrawableId;
        this.videoPathInRaw = videoPathInRaw;
        this.thumbnailUri = null;
        this.videoPath = null;
        this.tag = tag;
        this.likes = 0;
        this.dislikes = 0;
        this.views = 0;
        this.comments = new ArrayList<>();
        this.dateOfPublish = Calendar.getInstance().getTime();
    }

    public Video(int id, String publisher, String title, String description, String tag, int thumbnailDrawableId, String videoPath) {
//        this.duration = duration;
        this.id = id;
        this.publisher = publisher;
        this.title = title;
        this.description = description;
        this.videoPath = videoPath;
        this.thumbnailDrawableId = thumbnailDrawableId;
        this.thumbnailUri = null;
        this.videoPathInRaw = null;
        this.tag = tag;
        this.likes = 0;
        this.dislikes = 0;
        this.views = 0;
        this.comments = new ArrayList<>();
        this.dateOfPublish = Calendar.getInstance().getTime();
    }

    public Video(int id, String publisher, String title, String description, String tag, Uri thumbnailUri, String videoPath) {
//        this.duration = duration;
        this.id = id;
        this.publisher = publisher;
        this.title = title;
        this.description = description;
        this.videoPath = videoPath;
        this.thumbnailUri = thumbnailUri;
        this.thumbnailDrawableId = 0;
        this.videoPathInRaw = null;
        this.tag = tag;
        this.likes = 0;
        this.dislikes = 0;
        this.views = 0;
        this.comments = new ArrayList<>();
        this.dateOfPublish = Calendar.getInstance().getTime();
    }
    public String getTag() {
        return tag;
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
    public int getId() {
        return id;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setVideoPath(String videoPath) {
        this.videoPath = videoPath;
    }

    public void setTag(String tags) {
        this.tag = tags;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public void setDislikes(int dislikes) {
        this.dislikes = dislikes;
    }

    public void setViews(int views) {
        this.views = views;
    }

    public void setThumbnailDrawableId(int thumbnailDrawableId) {
        this.thumbnailDrawableId = thumbnailDrawableId;
    }

    public void setComments(ArrayList<Comment> comments) {
        this.comments = comments;
    }

    public void setDateOfPublish(Date dateOfPublish) {
        this.dateOfPublish = dateOfPublish;
    }

    public void setVideoPathInRaw(Uri videoPathInRaw) {
        this.videoPathInRaw = videoPathInRaw;
    }

    public void setThumbnailUri(Uri thumbnailUri) {
        this.thumbnailUri = thumbnailUri;
    }
}

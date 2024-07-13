package com.example.aspp.viewmodels;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.aspp.entities.SignedPartialVideoUpdate;
import com.example.aspp.entities.UnsignedPartialVideoUpdate;
import com.example.aspp.entities.Video;
import com.example.aspp.repositories.VideoRepository;

import java.util.List;

public class VideosViewModel extends ViewModel {
    private VideoRepository repository;
    private LiveData<List<Video>> videos;
    private LiveData<Video> video;

    public VideosViewModel () {
        repository = new VideoRepository();
        videos = repository.getAll();
    }

    public LiveData<List<Video>> get() {
        return videos;
    }
    public LiveData<Video> getVideoById(String id) {
        video = repository.getVideoById(id);
        return video;
    }
    public LiveData<List<Video>> getRelatedVideos(String id) {
        videos = repository.getRelatedVideos(id);
        return videos;
    }
    public LiveData<Video> partialUpdateVideo(SignedPartialVideoUpdate videoUpdate, String id) {
        video = repository.partialUpdateVideo(videoUpdate, id);
        return video;
    }
    public LiveData<Video> partialUpdateVideo(UnsignedPartialVideoUpdate videoUpdate, String id) {
        video = repository.partialUpdateVideo(videoUpdate, id);
        return video;
    }
    public void add (Video vid) {
        repository.add(vid);
    }

    public void delete (Video vid) {
        repository.delete(vid);
    }

    public void reload (Video vid) {
        repository.reload(vid);
    }
}

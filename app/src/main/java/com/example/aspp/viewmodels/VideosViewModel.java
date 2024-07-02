package com.example.aspp.viewmodels;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.aspp.Helper;
import com.example.aspp.entities.Video;
import com.example.aspp.repositories.VideoRepository;

import java.util.List;

public class VideosViewModel extends ViewModel {
    private VideoRepository repository;
    private LiveData<List<Video>> videos;

    public VideosViewModel () {
        repository = new VideoRepository();
        videos = repository.getAll();
    }

    public LiveData<List<Video>> get() {
        return videos;
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

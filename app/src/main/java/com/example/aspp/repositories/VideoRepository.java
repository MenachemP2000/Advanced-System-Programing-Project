package com.example.aspp.repositories;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.aspp.Helper;
import com.example.aspp.api.VideoAPI;
import com.example.aspp.dao.VideoDao;
import com.example.aspp.entities.Video;

import java.util.LinkedList;
import java.util.List;

public class VideoRepository {
    private VideoListData videoListData;
    private VideoDao dao;
    private VideoAPI api;
    private Context context;

    public VideoRepository() {
//        this.context = context;
        videoListData = new VideoListData();

        VideoAPI videoAPI= new VideoAPI(Helper.context);
        videoAPI.get(videoListData);
    }
    public LiveData<List<Video>> getAll() {
        return videoListData;
    }

    public void add(Video vid) {
    }

    public void delete(Video vid) {
    }

    public void reload(Video vid) {
    }

    class VideoListData extends MutableLiveData<List<Video>> {
        public VideoListData() {
            super();
            //load data from db
            setValue(new LinkedList<>());
        }

        @Override
        protected void onActive() {
            super.onActive();

            new Thread(() -> {
                VideoAPI api = new VideoAPI(Helper.context);
                api.get(this);
            }).start();
        }
    }
}

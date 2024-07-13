package com.example.aspp.repositories;

import android.content.Context;
import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.aspp.Helper;
import com.example.aspp.api.VideoAPI;
import com.example.aspp.dao.VideoDao;
import com.example.aspp.entities.SignedPartialVideoUpdate;
import com.example.aspp.entities.UnsignedPartialVideoUpdate;
import com.example.aspp.entities.Video;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class VideoRepository {
    private VideoListData videoListData;
    private VideoData videoData;
    private VideoDao dao;
    private VideoAPI api;
    private Context context;

    public VideoRepository() {
//        this.context = context;
        videoListData = new VideoListData();
        videoData = new VideoData();
        api= new VideoAPI(Helper.context);
        api.getAllVideos(videoListData);
    }
    public LiveData<List<Video>> getAll() {
        return videoListData;
    }
    public LiveData<Video> getVideoById(String id) {
        api.getVideoById(videoData, id);
        return videoData;
    }

    public LiveData<List<Video>> getRelatedVideos(String id) {
        api.getRelatedVideos(videoListData, id);
        return videoListData;
    }

    public LiveData<Video> partialUpdateVideo(SignedPartialVideoUpdate video, String id) {
        api.partialUpdateVideo(videoData, video, id);
        return videoData;
    }

    public LiveData<Video> partialUpdateVideo(UnsignedPartialVideoUpdate video, String id) {
        api.partialUpdateVideo(videoData, video, id);
        return videoData;
    }
    public LiveData<Video> add(Video vid) {
        api.createVideo(videoData, vid);
        return videoData;
    }

    public void delete(Video vid) {
        api.deleteVideo(vid.get_id());
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
                api.getAllVideos(this);
            }).start();
        }
    }

    class VideoData extends MutableLiveData<Video> {
        public VideoData() {
            super();
            //load data from db
            setValue(new Video(new String[]{"", ""}
                    ,new LinkedList<>(),"","","","",  "", "", "", 20, 30
                    ,  20, new ArrayList<>()));
        }

        @Override
        protected void onActive() {
            super.onActive();

//            new Thread(() -> {
//                VideoAPI api = new VideoAPI(Helper.context);
//                api.getAllVideos(this);
//            }).start();
        }
    }
}

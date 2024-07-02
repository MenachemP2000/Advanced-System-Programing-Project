package com.example.aspp.api;

import com.example.aspp.entities.Video;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;

public interface WebServiceAPI {
    @GET("videos/all")
    Call<List<Video>> getVideos();
}

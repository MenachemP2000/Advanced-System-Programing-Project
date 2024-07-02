package com.example.aspp.api;

import android.content.Context;
import android.util.Log;

import androidx.lifecycle.MutableLiveData;

import com.example.aspp.Helper;
import com.example.aspp.MainActivity;
import com.example.aspp.R;
import com.example.aspp.entities.Video;
import com.google.gson.JsonArray;

import org.json.JSONObject;

import java.util.List;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;


public class VideoAPI {
    Retrofit retrofit;
    WebServiceAPI webServiceAPI;
    public VideoAPI(Context context) {
        retrofit = new Retrofit.Builder()
                .baseUrl(Helper.context.getResources().getString(R.string.BaseURL))
                .callbackExecutor(Executors.newSingleThreadExecutor())
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        webServiceAPI = retrofit.create(WebServiceAPI.class);
    }

    public void get(MutableLiveData<List<Video>> videos) {
        Call<List<Video>> call = webServiceAPI.getVideos();

        call.enqueue(new Callback<List<Video>>() {
            @Override
            public void onResponse(Call<List<Video>> call, Response<List<Video>> response) {
                Log.i("RESPONSE", response.body().toString());
//                for (int i = 0; i < response.body().size(); i++) {
//                    JSONObject json_obj = videoData.getJSONObject(i);
//                    String publisher_id = json_obj.getString("publisher");
//                    double duration = json_obj.getDouble("duration");
//                    String title = json_obj.getString("title");
//                    String description = json_obj.getString("description");
//                    String tags = json_obj.getString("tags");
//                    int thumbnailDrawableID = string2drawbleId(context, json_obj.getString("thumbnailID"));
//                    int id = json_obj.getInt("id");
//                    String videoPathInRaw = json_obj.getString("videoPathInRaw");
//
//                    Video temp = new Video(id, publisher_id, title, description, tags, thumbnailDrawableID, videoPathInRaw);
//                    result.add(temp);
//                }
                videos.postValue(response.body());
            }

            @Override
            public void onFailure(Call<List<Video>> call, Throwable t) {
                Log.e("ERROR", t.getMessage());
            }
        });
    }
}

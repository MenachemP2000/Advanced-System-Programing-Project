package com.example.aspp.api;

import android.content.Context;
import android.util.Log;

import androidx.lifecycle.MutableLiveData;

import com.example.aspp.Helper;
import com.example.aspp.R;
import com.example.aspp.entities.User;
import com.example.aspp.entities.Users;
import com.example.aspp.entities.Video;

import java.util.List;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class UserAPI {
    Retrofit retrofit;
    userWebServiceAPI userWebServiceAPI;
    public UserAPI() {
        retrofit = new Retrofit.Builder()
                .baseUrl(Helper.context.getResources().getString(R.string.BaseURL))
                .callbackExecutor(Executors.newSingleThreadExecutor())
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        userWebServiceAPI = retrofit.create(userWebServiceAPI.class);
    }

    public void getAllUsers(MutableLiveData<List<User>> videos) {
        Call<List<User>> call = userWebServiceAPI.getAllUsers();

        call.enqueue(new Callback<List<User>>() {
            @Override
            public void onResponse(Call<List<User>> call, Response<List<User>> response) {
                Log.i("All Videos", response.raw().toString());
                videos.postValue(response.body());
            }

            @Override
            public void onFailure(Call<List<User>> call, Throwable t) {
                Log.e("ERROR", t.getMessage());
            }
        });
    }
    public void getUserByUsername(MutableLiveData<User> user, String username) {
        Call<User> call = userWebServiceAPI.getUserByUserName(username);

        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                Log.i("Get user", response.message());
//                Log.i("Get user", response.body().toString());
                Log.i("Get user", String.valueOf(response.code()));
                if (response.message().equals("Not found"))
                    user.postValue(new User("","","","","",0));
                else
                    user.postValue(response.body());
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Log.e("ERROR", t.getMessage());
            }
        });
    }

    public void createUser(MutableLiveData<User> user, Users newUser) {
        Call<User> call = userWebServiceAPI.createUser(newUser);

        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                Log.i("Create user", response.message());
                Log.i("Create user", response.toString());
                Log.i("Create user", String.valueOf(response.code()));
                if (response.message().equals("Conflict"))
                    user.postValue(new User("","","","","",0));
                else
                    user.postValue(response.body());
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Log.e("ERROR", t.getMessage());
            }
        });
    }
}

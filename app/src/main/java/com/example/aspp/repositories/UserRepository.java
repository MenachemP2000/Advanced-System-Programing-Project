package com.example.aspp.repositories;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.aspp.api.UserAPI;
import com.example.aspp.dao.UserDao;
import com.example.aspp.entities.User;
import com.example.aspp.entities.Users;

import java.util.LinkedList;
import java.util.List;

public class UserRepository {
    private UserRepository.UserListData usersListData;
    private UserRepository.UserData userData;
    private UserDao dao;
    private UserAPI api;
    private Context context;

    public UserRepository() {
//        this.context = context;
        usersListData = new UserRepository.UserListData();
        userData = new UserRepository.UserData();
        api= new UserAPI();
        api.getAllUsers(usersListData);
    }

    public LiveData<List<User>> getAll() {
        return usersListData;
    }

    public LiveData<User> getUserByUsername(String username) {
        api.getUserByUsername(userData, username);
        return userData;
    }
    public LiveData<User> createUser(Users user) {
        api.createUser(userData, user);
        return userData;
    }
    public void deleteUser(String usernameID) {
        api.deleteUser(usernameID);
    }
    public LiveData<User> updateUser(Users user, String id) {
        api.updateUser(userData, user, id);
        return userData;
    }
    class UserListData extends MutableLiveData<List<User>> {
        public UserListData() {
            super();
            //load data from db
            setValue(new LinkedList<>());
        }

        @Override
        protected void onActive() {
            super.onActive();

            new Thread(() -> {
                UserAPI api = new UserAPI();
                api.getAllUsers(this);
            }).start();
        }
    }

    class UserData extends MutableLiveData<User> {
        public UserData() {
            super();
            //load data from db
            setValue(new User("","","","","",0));
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

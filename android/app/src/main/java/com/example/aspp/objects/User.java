package com.example.aspp.objects;

import android.graphics.Bitmap;

import androidx.annotation.Nullable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;

public class User {

    private String username, id;
    private Date dateOfJoin;
    private ArrayList<User> subscribers;
    private ArrayList<Video> videos;
}


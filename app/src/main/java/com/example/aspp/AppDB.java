package com.example.aspp;

import androidx.room.Database;
import androidx.room.RoomDatabase;
import androidx.room.TypeConverters;

import com.example.aspp.dao.VideoDao;
import com.example.aspp.entities.Comment;
import com.example.aspp.entities.Video;

@Database(entities = {Video.class}, version = 1)
@TypeConverters({Converters.class})
public abstract class AppDB extends RoomDatabase {
    public abstract VideoDao commentDao();
}
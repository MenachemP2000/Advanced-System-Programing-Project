package com.example.aspp.dao;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import com.example.aspp.entities.Video;

import java.util.List;
@Dao
public interface VideoDao {
    @Query("SELECT * FROM Video")
    List<Video> index();

    @Query("SELECT * FROM Video WHERE _id = :id")
    Video get(int id);

    @Insert
    void insert(Video... videos);

    @Update
    void update(Video... videos);

    @Delete
    void delete(Video... videos);
}

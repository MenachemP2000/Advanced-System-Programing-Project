package com.example.aspp;

import androidx.room.ProvidedTypeConverter;
import androidx.room.TypeConverter;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@ProvidedTypeConverter
public class Converters {
    @TypeConverter
    public static Date toDate(Long dateLong){
        return dateLong == null ? null: new Date(dateLong);
    }

    @TypeConverter
    public static Long fromDate(Date date){
        return date == null ? null : date.getTime();
    }

    @TypeConverter
    public static String fromList(List<String> likes) {
        return new Gson().toJson(likes);
    }

    @TypeConverter
    public static List<String> toList(String likes) {
        return new Gson().fromJson(likes, new TypeToken<List<String>>(){}.getType());
    }
}
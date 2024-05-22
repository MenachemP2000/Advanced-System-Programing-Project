package com.example.aspp.objects;

import android.graphics.Bitmap;

import androidx.annotation.Nullable;

import com.example.surveymaster.objects.Survey;

import java.util.ArrayList;

public class User {
    private String first_name, last_name, occupation, level_of_education, sex;
    private int age;
    private ArrayList <Survey> published_surveys, participated_surveys;
    Bitmap profilePic;

    public User(String first_name, String last_name, String occupation, String level_of_education, String sex, int age,
                @Nullable Bitmap profilePic) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.sex = sex;
        this.occupation = occupation;
        this.level_of_education = level_of_education;
        this.age = age;
        this.published_surveys = new ArrayList<>();
        this.participated_surveys = new ArrayList<>();
        this.profilePic = profilePic;
    }

    public String getFirst_name() {
        return first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public String getOccupation() {
        return occupation;
    }

    public String getLevel_of_education() {
        return level_of_education;
    }

    public String getSex() {
        return sex;
    }

    public int getAge() {
        return age;
    }

    public ArrayList<Survey> getPublished_surveys() {
        return published_surveys;
    }

    public ArrayList<Survey> getParticipated_surveys() {
        return participated_surveys;
    }

    public Bitmap getProfilePic() throws NullPointerException {
        //TODO
        return profilePic;
    }
}


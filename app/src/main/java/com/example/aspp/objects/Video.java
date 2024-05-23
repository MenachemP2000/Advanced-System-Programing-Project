package com.example.aspp.objects;

import android.graphics.Bitmap;
import android.os.Build;

import java.time.LocalDateTime;

public class Video {
    private User author;
    private String survey_name, survey_des;
    private int survey_reward, time_in_minutes, id, rating, answers;
    private double duration;
    private LocalDateTime date_of_publish;

    public Video(int id, User author, String survey_name, int survey_reward, int time_in_minutes, LocalDateTime date_of_publish) {
        this.rating = 0;
        this.answers = 0;
        this.author = author;
        this.survey_name = survey_name;
        this.survey_reward = survey_reward;
        this.time_in_minutes = time_in_minutes;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            this.date_of_publish = LocalDateTime.now();
        } else {
            this.date_of_publish = date_of_publish;
        }
    }

    public Video(int id, User author, String survey_name, String survey_des, int survey_reward, int time_in_minutes, LocalDateTime date_of_publish) {
        this.author = author;
        this.survey_name = survey_name;
        this.survey_des = survey_des;
        this.survey_reward = survey_reward;
        this.time_in_minutes = time_in_minutes;
        this.date_of_publish = date_of_publish;
        this.rating = 0;
        this.answers = 0;
    }

    public Video(int id, User author, String survey_name, int survey_reward, int time_in_minutes) {
        this.author = author;
        this.survey_name = survey_name;
        this.survey_reward = survey_reward;
        this.time_in_minutes = time_in_minutes;
        this.rating = 0;
        this.answers = 0;
    }

    public Video(int id, User author, String survey_name, String survey_des, int survey_reward, int time_in_minutes) {
        this.author = author;
        this.survey_name = survey_name;
        this.survey_des = survey_des;
        this.survey_reward = survey_reward;
        this.time_in_minutes = time_in_minutes;
        this.rating = 0;
        this.answers = 0;
    }

    public String getFirst_name() {
        return author.getFirst_name();
    }

    public String getLast_name() {
        return author.getLast_name();
    }

    public String getSurvey_name() {
        return survey_name;
    }

    public int getSurvey_reward() {
        return survey_reward;
    }

    public int getTime() {
        return time_in_minutes;
    }

    public String getSurvey_des() {
        if (survey_des == null){
            return "NULL";
        }
        return survey_des;
    }

    public int getAnswers() {
        return answers;
    }

    public void addAns(){
        this.answers++;
    }
    public float getRating(){
        if (this.answers == 0)
            return 0;
        double x = this.rating/this.answers;
        if (x % ((int) x) >= 0.75)
            return (int) (x + 0.25);
        if (x % ((int) x) < 0.25)
            return (int) x;
        return (float) ((int) x + 0.5);
    }
    public int get_id() {
        return id;
    }

    public Bitmap getProfilePic() throws NullPointerException {
        //TODO
        return author.getProfilePic();
    }
}

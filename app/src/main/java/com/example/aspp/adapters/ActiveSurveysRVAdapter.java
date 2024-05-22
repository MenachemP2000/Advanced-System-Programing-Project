package com.example.aspp.adapters;

import android.app.Activity;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RatingBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.aspp.R;
import com.example.aspp.objects.Survey;

import java.util.ArrayList;

public class ActiveSurveysRVAdapter extends RecyclerView.Adapter<ActiveSurveysRVAdapter.MyViewHolder> {

    Context context;
    ArrayList<Survey> surveys;
    int pos;
    public ActiveSurveysRVAdapter(Context context, ArrayList<Survey> surveys) {
        this.context = context;
        this.surveys = surveys;
    }

    @NonNull
    @Override
    public ActiveSurveysRVAdapter.MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View v = inflater.inflate(R.layout.active_survey_rv_template, parent, false);

        return new ActiveSurveysRVAdapter.MyViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ActiveSurveysRVAdapter.MyViewHolder holder, int position) {
//        holder.id.setText(surveys.get(position).get_id() + "");
        holder.surveyName.setText(surveys.get(position).getSurvey_name());
        holder.countOfAnswers.setText("The rating is according to " + surveys.get(position).getAnswers() + " users who fill this survey");
        holder.ratingBar.setRating(surveys.get(position).getRating());
//        holder.profilePic.setImageBitmap(surveys.get(position).getProfilePic());
        holder.v.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

            }
        });
    }

    @Override
    public int getItemCount() {
        return surveys.size();
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {
        TextView surveyName, countOfAnswers;
        RatingBar ratingBar;
        View v;
        public MyViewHolder(@NonNull View itemView) {
            super(itemView);

//            id = itemView.findViewById(R.id.item_id);
            surveyName = itemView.findViewById(R.id.survey_name);
            countOfAnswers = itemView.findViewById(R.id.count_of_ans);
            ratingBar = itemView.findViewById(R.id.ratingBar);
            v = itemView;
        }
    }
}


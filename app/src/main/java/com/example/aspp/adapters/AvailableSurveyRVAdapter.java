package com.example.aspp.adapters;

import android.app.Activity;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.aspp.R;
import com.example.aspp.objects.Survey;

import java.util.ArrayList;

public class AvailableSurveyRVAdapter extends RecyclerView.Adapter<AvailableSurveyRVAdapter.MyViewHolder> {

    Context context;
    ArrayList<Survey> surveys;
    int pos;
    public AvailableSurveyRVAdapter(Context context, ArrayList<Survey> surveys) {
        this.context = context;
        this.surveys = surveys;
    }

    @NonNull
    @Override
    public AvailableSurveyRVAdapter.MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View v = inflater.inflate(R.layout.available_survey_rv_template, parent, false);

        return new AvailableSurveyRVAdapter.MyViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull AvailableSurveyRVAdapter.MyViewHolder holder, int position) {
//        holder.id.setText(surveys.get(position).get_id() + "");
        holder.surveyName.setText(surveys.get(position).getSurvey_name());
        holder.surveyReward.setText(surveys.get(position).getSurvey_reward() + " Coins");
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
        TextView surveyName, surveyReward;
        ImageView profilePic;
        View v;
        public MyViewHolder(@NonNull View itemView) {
            super(itemView);

            surveyName = itemView.findViewById(R.id.surveyName);
            surveyReward = itemView.findViewById(R.id.surveyReward);
            profilePic = itemView.findViewById(R.id.profilePic);
            v = itemView;
        }
    }
}

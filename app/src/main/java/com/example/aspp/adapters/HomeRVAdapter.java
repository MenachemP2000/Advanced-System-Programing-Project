package com.example.aspp.adapters;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.aspp.R;
import com.example.aspp.VideoPlayerActivity;
import com.example.aspp.fragments.HomeFragment;
import com.example.aspp.objects.Video;

import java.util.ArrayList;

public class HomeRVAdapter extends RecyclerView.Adapter<HomeRVAdapter.MyViewHolder> {

    Context context;
    ArrayList<Video> videos;
    int pos;
    public HomeRVAdapter(Context context, ArrayList<Video> videos) {
        this.context = context;
        this.videos = videos;
    }

    @NonNull
    @Override
    public HomeRVAdapter.MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View v = inflater.inflate(R.layout.home_rv_template, parent, false);

        return new HomeRVAdapter.MyViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull HomeRVAdapter.MyViewHolder holder, int position) {
//        holder.id.setText(surveys.get(position).get_id() + "");
        holder.surveyName.setText(videos.get(position).getTitle());
//        holder.surveyReward.setText(surveys.get(position).getSurvey_reward() + " Coins");
        holder.thumbnail.setImageResource(videos.get(position).getThumbnailDrawableId());
        holder.v.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                context.startActivity(new Intent(context, VideoPlayerActivity.class).putExtra("video", videos.get(position)));
            }
        });
        holder.v.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View view) {
                HomeFragment.showBottomDialog(context, videos.get(position));
                return true;
            }
        });

    }

    @Override
    public int getItemCount() {
        return videos.size();
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {
        TextView surveyName, surveyReward;
        ImageView thumbnail;
        View v;
        public MyViewHolder(@NonNull View itemView) {
            super(itemView);

            surveyName = itemView.findViewById(R.id.videoName);
            thumbnail = itemView.findViewById(R.id.thumbnail);
            v = itemView;
        }
    }
}

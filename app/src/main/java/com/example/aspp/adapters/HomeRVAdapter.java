package com.example.aspp.adapters;

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
import com.example.aspp.entities.Video;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

public class HomeRVAdapter extends RecyclerView.Adapter<HomeRVAdapter.MyViewHolder> {

    Context context;
    ArrayList<Video> videos;
    int pos;
    public HomeRVAdapter(Context context, List<Video> videos) {
        this.context = context;
        this.videos = new ArrayList<>(videos);
    }

    public void setVideos(List<Video> videos) {
        this.videos = new ArrayList<>(videos);
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
        holder.videoName.setText(videos.get(position).getTitle());
        holder.publisher.setText(videos.get(position).getPublisher());
        holder.views.setText(videos.get(position).getViews() + " Views");
//        holder.time.setText(new SimpleDateFormat("hh:mm dd-mm-yyyy").format(videos.get(position).getDateOfPublish()));
        if (videos.get(position).getThumbnailDrawableId() != 0)
            holder.thumbnail.setImageResource(videos.get(position).getThumbnailDrawableId());
        else
            holder.thumbnail.setImageURI(videos.get(position).getThumbnailUri());
        holder.v.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Video selectedVideo = videos.get(position);
                Intent intent = new Intent(context, VideoPlayerActivity.class);
                intent.putExtra("video_title", selectedVideo.getTitle());
                intent.putExtra("video_thumbnail", selectedVideo.getThumbnailDrawableId());
                intent.putExtra("video_videoPath", selectedVideo.getVideoPath());
                intent.putExtra("video_description", selectedVideo.getDescription());
                intent.putExtra("video_thumbnailUri", selectedVideo.getThumbnailUri());
                intent.putExtra("video_tags", selectedVideo.getTag());
                intent.putExtra("video_views", selectedVideo.getViews());
                intent.putExtra("video_likes", selectedVideo.getLikes());
                intent.putExtra("video_dislikes", selectedVideo.getDislikes());
                intent.putExtra("video_comments", selectedVideo.getComments());
//                intent.putExtra("video_date", new SimpleDateFormat("hh:mm dd-mm-yyyy").format(selectedVideo.getDateOfPublish()));
                intent.putExtra("video_publisher", selectedVideo.getPublisher());
                intent.putExtra("pos", position);
                context.startActivity(intent);
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
        TextView videoName, publisher, views, time;
        ImageView thumbnail;
        View v;
        public MyViewHolder(@NonNull View itemView) {
            super(itemView);

            videoName = itemView.findViewById(R.id.videoName);
            publisher = itemView.findViewById(R.id.publisher);
            views = itemView.findViewById(R.id.views);
            time = itemView.findViewById(R.id.time);
            thumbnail = itemView.findViewById(R.id.thumbnail);
            v = itemView;
        }
    }
}

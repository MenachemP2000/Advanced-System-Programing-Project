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
import com.example.aspp.objects.Video;

import java.text.SimpleDateFormat;
import java.util.ArrayList;

public class NotificationsRVAdapter extends RecyclerView.Adapter<NotificationsRVAdapter.MyViewHolder> {

    Context context;
    ArrayList<Video> notifications;
    int pos;
    public NotificationsRVAdapter(Context context, ArrayList<Video> notifications) {
        this.context = context;
        this.notifications = notifications;
    }

    @NonNull
    @Override
    public NotificationsRVAdapter.MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View v = inflater.inflate(R.layout.notifications_rv_template, parent, false);

        return new NotificationsRVAdapter.MyViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull NotificationsRVAdapter.MyViewHolder holder, int position) {
        holder.title.setText(notifications.get(position).getTitle());
        holder.publisher.setText(notifications.get(position).getPublisher());
        holder.time.setText(new SimpleDateFormat("hh:mm dd-mm-yyyy").format(notifications.get(position).getDateOfPublish()));
        holder.thumbnail.setImageResource(notifications.get(position).getThumbnailDrawableId());
        holder.profilePic.setImageResource(notifications.get(position).getThumbnailDrawableId());
        holder.v.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                context.startActivity(new Intent(context, VideoPlayerActivity.class).putExtra("video", notifications.get(position)));
            }
        });
        holder.v.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View view) {

                return true;
            }
        });

    }

    @Override
    public int getItemCount() {
        return notifications.size();
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {
        TextView title, publisher, time;
        ImageView thumbnail, profilePic;
        View v;
        public MyViewHolder(@NonNull View itemView) {
            super(itemView);

            title = itemView.findViewById(R.id.title);
            publisher = itemView.findViewById(R.id.publisher);
            time = itemView.findViewById(R.id.time);
            thumbnail = itemView.findViewById(R.id.thumbnail);
            profilePic = itemView.findViewById(R.id.profilePic);
            v = itemView;
        }
    }
}

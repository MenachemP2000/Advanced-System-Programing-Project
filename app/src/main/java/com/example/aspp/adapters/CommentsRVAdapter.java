package com.example.aspp.adapters;

import static com.example.aspp.Utils.getVideoById;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.aspp.R;
import com.example.aspp.VideoPlayerActivity;
import com.example.aspp.fragments.HomeFragment;
import com.example.aspp.entities.Comment;

import java.util.ArrayList;

public class CommentsRVAdapter extends RecyclerView.Adapter<CommentsRVAdapter.MyViewHolder> {

    Context context;
    ArrayList<Comment> comments;
    int pos;
    public CommentsRVAdapter(Context context, ArrayList<Comment> comments) {
        this.context = context;
        this.comments = comments;
    }

    @NonNull
    @Override
    public CommentsRVAdapter.MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View v = inflater.inflate(R.layout.comment_rv_template, parent, false);

        return new CommentsRVAdapter.MyViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull CommentsRVAdapter.MyViewHolder holder, int position) {
        holder.dislike.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                comments.get(position).subLike();
                notifyDataSetChanged();
            }
        });
        holder.like.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                comments.get(position).addLike();
                notifyDataSetChanged();
            }
        });
        holder.numOfReplays.setText(comments.get(position).getReplayComments().size() + " Replays");
        holder.comment.setText(comments.get(position).getText());
        holder.numOfDislikes.setText(comments.get(position).getDislikes() + " Dislikes");
        holder.numOfLikes.setText(comments.get(position).getLikes() + " Likes");

//        holder.c_profile.setImageBitmap();
        holder.v.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                VideoPlayerActivity.showCommentsDialog(context, comments.get(position).getReplayComments(),
                        HomeFragment.videoArrayList.get(getVideoById(comments.get(position).getVideoId())));
            }
        });

    }

    @Override
    public int getItemCount() {
        return comments.size();
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {
        TextView comment, numOfLikes, numOfDislikes, numOfReplays;
        ImageView c_profile;
        Button like, dislike;
        View v;
        public MyViewHolder(@NonNull View itemView) {
            super(itemView);

            comment = itemView.findViewById(R.id.comment);
            numOfLikes = itemView.findViewById(R.id.num_of_likes);
            numOfDislikes = itemView.findViewById(R.id.num_of_dislikes);
            numOfReplays = itemView.findViewById(R.id.num_of_replays);
            c_profile = itemView.findViewById(R.id.c_profile);
            like = itemView.findViewById(R.id.like);
            dislike = itemView.findViewById(R.id.dislike);
            v = itemView;
        }
    }
}

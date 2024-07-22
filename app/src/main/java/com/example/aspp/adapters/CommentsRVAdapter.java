package com.example.aspp.adapters;

import static android.widget.Toast.LENGTH_SHORT;
import static com.example.aspp.Utils.getVideoById;
import static com.example.aspp.VideoPlayerActivity.getCircularBitmap;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.aspp.R;
import com.example.aspp.VideoPlayerActivity;
import com.example.aspp.fragments.HomeFragment;
import com.example.aspp.objects.Comment;
import com.example.aspp.objects.User;
import com.example.aspp.objects.Video;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

public class CommentsRVAdapter extends RecyclerView.Adapter<CommentsRVAdapter.MyViewHolder> {

    Context context;
    ArrayList<Comment> comments;

    private User myUser;

    int pos;

    public CommentsRVAdapter(Context context, ArrayList<Comment> comments) {
        this.context = context;
        this.comments = comments;
    }

    public CommentsRVAdapter(Context context, ArrayList<Comment> comments, User myUser) {
        this.context = context;
        this.comments = comments;
        this.myUser = myUser;
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
        Log.d("CommentsRVAdapter", "onBindViewHolder called for position: " + position);
        String photo = null;

        holder.c_profile.setImageResource(R.drawable.baseline_light_mode_24);
        holder.dislike.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(!(myUser == null)) {
                    if(!(myUser.getDislikedComments().contains(comments.get(position)))){
                        comments.get(position).subLike();
                        myUser.getDislikedComments().add(comments.get(position));
                        notifyDataSetChanged();
                    }
                    else{
                        myUser.getDislikedComments().remove(comments.get(position));
                        comments.get(position).noDisLike();
                        notifyDataSetChanged();
                    }
                }
            }
        });

        holder.edit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(myUser.getComments().contains(comments.get(position)))
                 {
                    showEditDialog(comments.get(position));
                    notifyDataSetChanged();
                }
            }
        });

        holder.like.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(!(myUser == null)) {
                    if(!(myUser.getLikedComments().contains(comments.get(position)))){
                        comments.get(position).addLike();
                        myUser.getLikedComments().add(comments.get(position));
                        notifyDataSetChanged();
                    }
                    else{
                        myUser.getLikedComments().remove(comments.get(position));
                        comments.get(position).noLike();
                        notifyDataSetChanged();
                    }
                }
            }
        });

        holder.numOfReplays.setText(comments.get(position).getReplayComments().size() + " Replays");
        holder.comment.setText(comments.get(position).getText());
        holder.numOfDislikes.setText(comments.get(position).getDislikes() + " Dislikes");
        holder.numOfLikes.setText(comments.get(position).getLikes() + " Likes");

        Comment currentComment = comments.get(position);

        if (myUser != null) {
            try {
                // Read the JSON file
                File file = new File(context.getFilesDir(), "user_credentials.json");
                StringBuilder json = new StringBuilder();
                BufferedReader br = new BufferedReader(new FileReader(file));
                String line;
                while ((line = br.readLine()) != null) {
                    json.append(line).append('\n');
                }
                br.close();
                JSONArray jsonArray = new JSONArray(json.toString());

                for (int i = 0; i < jsonArray.length(); i++) {
                    JSONObject user = jsonArray.getJSONObject(i);
                    int number = Integer.valueOf(user.getString("id"));
                    if (number == currentComment.getPublisherId()) {
                        photo = user.getString("photo");
                        break;
                    }
                }
            } catch (IOException | JSONException e) {
                e.printStackTrace();
            }

            int number = Integer.valueOf(myUser.getId());
            if (comments.get(position).getId() != number && photo != null) {
                Uri profilePictureUri = Uri.parse(photo);
                try (InputStream inputStream = context.getContentResolver().openInputStream(profilePictureUri)) {
                    if (inputStream != null) {
                        Bitmap bitmap = BitmapFactory.decodeStream(inputStream);
                        Bitmap circularBitmap = getCircularBitmap(bitmap);
                        Bitmap resizedBitmap = Bitmap.createScaledBitmap(circularBitmap, 115, 115, false);
                        Drawable drawable = new BitmapDrawable(context.getResources(), resizedBitmap);
                        holder.c_profile.setImageDrawable(drawable);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    Log.e("CommentsRVAdapter", "Error setting profile picture", e);
                }
            } else {
                Log.d("CommentsRVAdapter", "No profile picture to set or IDs match.");
            }
        } else {
            Log.d("CommentsRVAdapter", "myUser is null");
        }

        holder.v.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d("CommentsRVAdapter", "Comment clicked. Showing comments dialog.");
                VideoPlayerActivity.showCommentsDialog(context, comments.get(position).getReplayComments(),
                        HomeFragment.videoArrayList.get(getVideoById(comments.get(position).getVideoId())));
            }
        });
    }

    @Override
    public int getItemCount() {
        return comments.size();
    }

    private void showEditDialog(Comment comment) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle("Edit Comment");

        final EditText input = new EditText(context);
        input.setText(comment.getText());
        builder.setView(input);

        builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                String newCommentText = input.getText().toString();
                comment.setText(newCommentText);
                notifyDataSetChanged();
                Toast.makeText(context, "Comment updated", LENGTH_SHORT).show();
            }
        });

        builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();
            }
        });

        builder.show();
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {
        TextView comment, numOfLikes, numOfDislikes, numOfReplays;
        ImageView c_profile;
        Button like, dislike;
        ImageView edit;
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
            edit = itemView.findViewById(R.id.edit);
        }
    }
}

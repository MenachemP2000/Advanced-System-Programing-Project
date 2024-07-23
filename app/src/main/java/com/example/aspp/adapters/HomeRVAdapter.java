package com.example.aspp.adapters;


import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.AsyncTask;

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
import com.example.aspp.objects.User;
import com.example.aspp.objects.Video;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

import android.graphics.BitmapShader;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Shader;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


public class HomeRVAdapter extends RecyclerView.Adapter<HomeRVAdapter.MyViewHolder> {

    Context context;
    ArrayList<Video> videos;

    private User myUser;
    int pos;
    public HomeRVAdapter(Context context, ArrayList<Video> videos) {
        this.context = context;
        this.videos = videos;
    }

    public HomeRVAdapter(Context context, ArrayList<Video> videos, User myUser) {
        this.context = context;
        this.videos = videos;
        this.myUser = myUser;
    }

    @NonNull
    @Override
    public HomeRVAdapter.MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View v = inflater.inflate(R.layout.home_rv_template, parent, false);
        return new HomeRVAdapter.MyViewHolder(v);
    }
    String photo;


    @Override
    public void onBindViewHolder(@NonNull HomeRVAdapter.MyViewHolder holder, int position) {
        Video currentVideo = videos.get(position);
        User currentUser = currentVideo.getUser();
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

            // Convert the JSON string to JSONObject and check credential
            JSONArray jsonArray = new JSONArray(json.toString());

            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject user = jsonArray.getJSONObject(i);
                // Check if the entered credentials match (case-sensitive and trimmed)
                if(user.getString("username").equals(currentVideo.getPublisher())) {
                    photo = user.getString("photo");
                }
            }
        } catch (IOException | JSONException e) {
            e.printStackTrace();
        }


        if (!currentVideo.getPublisher().equals("212543772")) {
            Uri profilePictureUri = Uri.parse(photo);
            try (InputStream inputStream = context.getContentResolver().openInputStream(profilePictureUri)) {
                if (inputStream != null) {
                    Bitmap bitmap = BitmapFactory.decodeStream(inputStream);
                    Bitmap circularBitmap = getCircularBitmap(bitmap);
                    Bitmap resizedBitmap = Bitmap.createScaledBitmap(circularBitmap, 115, 115, false);
                    Drawable drawable = new BitmapDrawable(context.getResources(), resizedBitmap);
                    holder.profilePic.setImageDrawable(drawable);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        holder.videoName.setText(videos.get(position).getTitle());
        holder.publisher.setText(videos.get(position).getPublisher());
        holder.views.setText(videos.get(position).getViews() + " Views");
        holder.time.setText(new SimpleDateFormat("hh:mm dd-mm-yyyy").format(videos.get(position).getDateOfPublish()));
        if (videos.get(position).getThumbnailDrawableId() != 0)
            holder.thumbnail.setImageResource(videos.get(position).getThumbnailDrawableId());
        else
            holder.thumbnail.setImageURI(videos.get(position).getThumbnailUri());

        holder.v.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Video selectedVideo = videos.get(position);
                Intent intent = new Intent(context, VideoPlayerActivity.class);
                intent.putExtra("loggedInUser", myUser);
                intent.putExtra("video_title", selectedVideo.getTitle());
                intent.putExtra("video_thumbnail", selectedVideo.getThumbnailDrawableId());
                intent.putExtra("video_videoPath", selectedVideo.getVideoPath());
                intent.putExtra("video_description", selectedVideo.getDescription());
                intent.putExtra("video_thumbnailUri", selectedVideo.getThumbnailUri());
                intent.putExtra("video_tags", selectedVideo.getTags());
                intent.putExtra("video_views", selectedVideo.getViews());
                intent.putExtra("video_likes", selectedVideo.getLikes());
                intent.putExtra("video_dislikes", selectedVideo.getDislikes());
                intent.putExtra("video_comments", selectedVideo.getComments());
                intent.putExtra("video_date", new SimpleDateFormat("hh:mm dd-mm-yyyy").format(selectedVideo.getDateOfPublish()));
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

    private Bitmap getCircularBitmap(Bitmap bitmap) {
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int minEdge = Math.min(width, height);
        int dx = (width - minEdge) / 2;
        int dy = (height - minEdge) / 2;

        BitmapShader shader = new BitmapShader(Bitmap.createBitmap(bitmap, dx, dy, minEdge, minEdge),
                Shader.TileMode.CLAMP, Shader.TileMode.CLAMP);
        Bitmap output = Bitmap.createBitmap(minEdge, minEdge, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(output);
        Paint paint = new Paint();
        paint.setShader(shader);
        paint.setAntiAlias(true);

        float r = minEdge / 2f;
        canvas.drawCircle(r, r, r, paint);
        return output;
    }

    @Override
    public int getItemCount() {
        return videos.size();
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {
        TextView videoName, publisher, views, time;
        ImageView thumbnail;
        View v;

        ImageView profilePic;
        public MyViewHolder(@NonNull View itemView) {
            super(itemView);
            videoName = itemView.findViewById(R.id.videoName);
            publisher = itemView.findViewById(R.id.publisher);
            views = itemView.findViewById(R.id.views);
            time = itemView.findViewById(R.id.time);
            thumbnail = itemView.findViewById(R.id.thumbnail);
            v = itemView;
            profilePic = itemView.findViewById(R.id.profilePic);
        }
    }

    private class LoadImageTask extends AsyncTask<String, Void, Bitmap> {
        ImageView imageView;

        public LoadImageTask(ImageView imageView) {
            this.imageView = imageView;
        }

        @Override
        protected Bitmap doInBackground(String... params) {
            String uri = params[0];
            try {
                InputStream inputStream = context.getContentResolver().openInputStream(Uri.parse(uri));
                return BitmapFactory.decodeStream(inputStream);
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }

        @Override
        protected void onPostExecute(Bitmap bitmap) {
            if (bitmap != null) {
                imageView.setImageBitmap(bitmap);
            } else {
                imageView.setImageResource(R.drawable.outline_face_retouching_natural_24); // Set a default profile picture if loading fails
            }
        }

}
}

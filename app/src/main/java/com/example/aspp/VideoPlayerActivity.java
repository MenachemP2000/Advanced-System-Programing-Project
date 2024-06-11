package com.example.aspp;

import static com.example.aspp.fragments.HomeFragment.adp;
import static com.example.aspp.fragments.HomeFragment.videoArrayList;

import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.MediaController;
import android.widget.TextView;
import android.widget.VideoView;

import androidx.activity.EdgeToEdge;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.aspp.adapters.HomeRVAdapter;
import com.example.aspp.fragments.HomeFragment;
import com.example.aspp.objects.Comment;
import com.example.aspp.objects.Video;

import java.text.SimpleDateFormat;
import java.util.ArrayList;

public class VideoPlayerActivity extends AppCompatActivity {
    TextView title, views, time, more, publisher, subscribers, comments, comment;
    RecyclerView related_videos;
    ImageView c_profile, profilePic;
    Button subscribe, like, dislike, share, watch_later, playlist;
    MediaController mediaController;
    VideoView videoView;
    HomeRVAdapter related;
    ArrayList<Video> relatedVideoArrayList;
    Video currentVideo;
    @RequiresApi(api = Build.VERSION_CODES.TIRAMISU)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_video_player);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        Intent intent = getIntent();
        currentVideo = HomeFragment.videoArrayList.get(intent.getIntExtra("pos",0));
        currentVideo.addView();
        ArrayList<Comment> commentSection = currentVideo.getComments();
        String vid = currentVideo.getVideoPath();

        videoView = findViewById(R.id.videoView);
        mediaController = new MediaController(this);
        videoView.setMediaController(mediaController);
        if (intent.getIntExtra("video_thumbnail",0) != 0)
            videoView.setVideoURI(Uri.parse("android.resource://com.example.aspp/"+getResources().getIdentifier(vid,"raw",getPackageName())));
        else
            videoView.setVideoURI(Uri.parse(vid));
        videoView.start();

        title = findViewById(R.id.title);
        title.setText(currentVideo.getTitle());
        views = findViewById(R.id.views);
        views.setText(currentVideo.getViews() + "Views");
        time = findViewById(R.id.time);
        time.setText(new SimpleDateFormat("hh:mm dd-mm-yyyy").format(currentVideo.getDateOfPublish()));
        more = findViewById(R.id.more);
        more.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                showBottomDialog(VideoPlayerActivity.this);
            }
        });
        publisher = findViewById(R.id.publisher);
        publisher.setText(currentVideo.getPublisher());
        subscribers = findViewById(R.id.subscribers);
        comments = findViewById(R.id.comments);
//        comments.setText(commentSection.size());
        comment = findViewById(R.id.comment);
//        comments.setText(commentSection.get(0).getInfo);

        c_profile = findViewById(R.id.c_profile);
        profilePic = findViewById(R.id.profilePic);
        subscribe = findViewById(R.id.subscribe);
        like = findViewById(R.id.like);
        like.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                currentVideo.addLike();
                adp.notifyDataSetChanged();
            }
        });
        dislike = findViewById(R.id.dislike);
        dislike.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                currentVideo.subLike();
                adp.notifyDataSetChanged();
            }
        });
        share = findViewById(R.id.share);
        share.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent shareIntent = new Intent(Intent.ACTION_SEND);
                shareIntent.setType("text/plain");
                String body = "Check out this video!";
                String sub = "Check out this video!\n" + currentVideo.getTitle();
                shareIntent.putExtra(Intent.EXTRA_TEXT, body);
                shareIntent.putExtra(Intent.EXTRA_TEXT, sub);
                startActivity(Intent.createChooser(shareIntent, "Share using"));
            }
        });
        watch_later = findViewById(R.id.watch_later);
        watch_later.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

            }
        });
        playlist = findViewById(R.id.playlist);
        playlist.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

            }
        });

        related_videos = findViewById(R.id.related_videos);
        relatedVideoArrayList = new ArrayList<>();
        relatedVideoArrayList.addAll(videoArrayList);
        related = new HomeRVAdapter(this, videoArrayList);
        related_videos.setAdapter(related);
        related_videos.setLayoutManager(new LinearLayoutManager(this));
    }
    public void showBottomDialog(Context context) {

        final Dialog dialog = new Dialog(context);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.description_bottom_sheet_layout);

        TextView dtitle = dialog.findViewById(R.id.title);
        dtitle.setText(currentVideo.getTitle());
        TextView dviews = dialog.findViewById(R.id.views);
        dviews.setText(currentVideo.getViews() + "\nViews");
        TextView dlikes = dialog.findViewById(R.id.likes);
        dlikes.setText(currentVideo.getLikes() + "\nLikes");
        TextView ddescription = dialog.findViewById(R.id.description);
        ddescription.setText(currentVideo.getDescription());
        ImageView layout_cancel = dialog.findViewById(R.id.cancelButton);
        layout_cancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                dialog.dismiss();
            }
        });

        dialog.show();
        dialog.getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        dialog.getWindow().getAttributes().windowAnimations = R.style.DialogAnimation;
        dialog.getWindow().setGravity(Gravity.BOTTOM);
    }
    @Override
    public void onBackPressed() {
        super.onBackPressed();
        startActivity(new Intent(this, MainActivity.class));
    }
}
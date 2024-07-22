package com.example.aspp;

import static com.example.aspp.Utils.generateId;
import static com.example.aspp.Utils.loadComments;
import static com.example.aspp.fragments.HomeFragment.adp;
import static com.example.aspp.fragments.HomeFragment.videoArrayList;

import static java.security.AccessController.getContext;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;

import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.Button;
import android.widget.EditText;

import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.MediaController;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.VideoView;

import androidx.activity.EdgeToEdge;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.aspp.adapters.CommentsRVAdapter;
import com.example.aspp.adapters.HomeRVAdapter;
import com.example.aspp.fragments.HomeFragment;
import com.example.aspp.objects.Comment;
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


import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


public class VideoPlayerActivity extends AppCompatActivity {

    String videoTitle;

    String description;

    private static final int CURRENT_USER =212543772;

    static User myUser;
    TextView title, views, time, more, publisher, subscribers, comments, comment;
    RecyclerView related_videos;
    ImageView c_profile, profilePic;
    Button subscribe, like, dislike, share, watch_later, playlist;
    MediaController mediaController;
    VideoView videoView;
    HomeRVAdapter related;
    ArrayList<Video> relatedVideoArrayList;
    Video currentVideo;

    String photo;



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
        User loggedInUser = (User) getIntent().getSerializableExtra("loggedInUser");
        if (loggedInUser != null) {
            Log.d("MainActivity", "Logged in user: " + loggedInUser.getUsername());
            myUser = loggedInUser;
        }
        currentVideo = HomeFragment.videoArrayList.get(intent.getIntExtra("pos",0));
        currentVideo.addView();
        loadComments(currentVideo.getId());
        currentVideo = HomeFragment.videoArrayList.get(intent.getIntExtra("pos",0));
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

        try {
            // Read the JSON file
            File file = new File(getFilesDir(), "user_credentials.json");
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
        ImageView editTitleButton = findViewById(R.id.editTitleButton);
        ImageView profile =  findViewById(R.id.profilePic);
        title = findViewById(R.id.title);
        title.setText(currentVideo.getTitle());
        views = findViewById(R.id.views);
        views.setText(currentVideo.getViews() + "Views");
        time = findViewById(R.id.time);
        time.setText(new SimpleDateFormat("hh:mm dd-mm-yyyy").format(currentVideo.getDateOfPublish()));
        more = findViewById(R.id.more);
        if(currentVideo.getId() != 212543772){
                try{
                    InputStream inputStream = this.getContentResolver().openInputStream(Uri.parse(photo));
                    Bitmap bitmap = BitmapFactory.decodeStream(inputStream);
                    Bitmap circularBitmap = getCircularBitmap(bitmap);
                    profile.setImageBitmap(circularBitmap);
                } catch (Exception e) {
                    e.printStackTrace();
                }
        }
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
        comment = findViewById(R.id.comment);
        comments.setText(commentSection.size() + " ");
        try {
            comment.setText(commentSection.get(0).getText());
        }
        catch (Exception e) {
            Log.d("Exception", e.getMessage());
            comment.setText("No comments are available right now");
        }
        LinearLayout layout_commentSection = findViewById(R.id.comment_section);
        layout_commentSection.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                showCommentsDialog(VideoPlayerActivity.this, currentVideo.getComments(), currentVideo);
            }
        });

        editTitleButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(myUser == null){
                    Toast.makeText(VideoPlayerActivity.this, "You can't edit this video details", Toast.LENGTH_SHORT).show();
                }
                else {
                    if (currentVideo.getPublisher().equals(myUser.getUsername())) {
                        showEditTitleDialog();
                    } else {
                        Toast.makeText(VideoPlayerActivity.this, "You can't edit this video details", Toast.LENGTH_SHORT).show();
                    }
                }
            }
        });
        c_profile = findViewById(R.id.c_profile);
        profilePic = findViewById(R.id.profilePic);
        subscribe = findViewById(R.id.subscribe);
        like = findViewById(R.id.like);
        like.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (myUser != null) {
                    if (myUser.isVideoLiked(currentVideo)) {
                        Toast.makeText(VideoPlayerActivity.this, "You already liked this video", Toast.LENGTH_SHORT).show();
                    } else {
                        // If the video is disliked, remove it from disliked list
                        if (myUser.isVideoDisliked(currentVideo)) {
                            myUser.removeDislikedVideo(currentVideo);
                           currentVideo.addLike();
                        }
                        currentVideo.addLike();
                        myUser.addLikedVideo(currentVideo);
                        adp.notifyDataSetChanged();
                    }
                } else {
                    Toast.makeText(VideoPlayerActivity.this, "You must be logged in to like a video.", Toast.LENGTH_SHORT).show();
                }
            }
        });
        dislike = findViewById(R.id.dislike);
        dislike.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (myUser != null) {
                    if (myUser.isVideoDisliked(currentVideo)) {
                        Toast.makeText(VideoPlayerActivity.this, "You already disliked this video", Toast.LENGTH_SHORT).show();
                    } else {
                        // If the video is liked, remove it from liked list
                        if (myUser.isVideoLiked(currentVideo)) {
                            myUser.removeLikedVideo(currentVideo);
                            currentVideo.subLike();
                        }
                        currentVideo.subLike();
                        myUser.addDislikedVideo(currentVideo);
                        adp.notifyDataSetChanged();
                    }
                } else {
                    Toast.makeText(VideoPlayerActivity.this, "You must be logged in to dislike a video.", Toast.LENGTH_SHORT).show();
                }
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
        related = new HomeRVAdapter(this, videoArrayList, myUser);
        related_videos.setAdapter(related);
        related_videos.setLayoutManager(new LinearLayoutManager(this));
    }
    public static void showCommentsDialog(Context context, ArrayList<Comment> c, Video vid) {

        final Dialog dialog = new Dialog(context);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.comment_section_bottom_sheet_layout);
        ImageView profile = dialog.findViewById(R.id.profilePic);
        if(myUser != null){
            try{
                InputStream inputStream = context.getContentResolver().openInputStream(Uri.parse(myUser.getProfilePictureUri()));
                Bitmap bitmap = BitmapFactory.decodeStream(inputStream);
                Bitmap circularBitmap = getCircularBitmap(bitmap);
                profile.setImageBitmap(circularBitmap);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }



        RecyclerView comments = dialog.findViewById(R.id.comment_section);
        CommentsRVAdapter Cadp = new CommentsRVAdapter(context, c, myUser);
        comments.setAdapter(Cadp);
        comments.setLayoutManager(new LinearLayoutManager(dialog.getContext()));
        ImageView profilePic = dialog.findViewById(R.id.profilePic);
        EditText comment = dialog.findViewById(R.id.comment);
        Button send = dialog.findViewById(R.id.send);
        ImageView edit = dialog.findViewById(R.id.editTitleButton);
        send.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(myUser == null){
                    comment.setError("You have to login to post a comment");
                }
                else {
                    if (comment.getText().toString().isEmpty()) {
                        comment.setError("Please enter a comment");
                    } else {
                        int user = Integer.parseInt(myUser.getId());
                        Comment newComment = new Comment(user, comment.getText().toString(), vid.getId(), generateId());
                        c.add(newComment);
                        myUser.addComment(newComment);
                        comment.setText("");
                        Cadp.notifyDataSetChanged();
                    }
                }
            }
        });
        ImageView layout_cancel = dialog.findViewById(R.id.cancelButton);
        layout_cancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });



        dialog.setOnCancelListener(new DialogInterface.OnCancelListener() {
            @Override
            public void onCancel(DialogInterface dialogInterface) {

                dialog.dismiss();
            }
        });
        dialog.show();
        dialog.getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        dialog.getWindow().getAttributes().windowAnimations = R.style.DialogAnimation;
        dialog.getWindow().setGravity(Gravity.BOTTOM);
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
        description = currentVideo.getDescription();
        ddescription.setText(description);
        ImageView layout_cancel = dialog.findViewById(R.id.cancelButton);
        layout_cancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });

        ImageView editDes = dialog.findViewById(R.id.imageEDButton);

        editDes.setOnClickListener(new View.OnClickListener() {

            public void onClick(View v) {
                if(myUser == null){
                    Toast.makeText(VideoPlayerActivity.this, "You can't edit this video details", Toast.LENGTH_SHORT).show();
                }
                else {
                    if (currentVideo.getPublisher().equals(myUser.getUsername())) {
                        showEditDesDialog(ddescription);
                    } else {
                        Toast.makeText(VideoPlayerActivity.this, "You can't edit this video details", Toast.LENGTH_SHORT).show();
                    }
                }
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
        Intent intent = new Intent(this, MainActivity.class);
        intent.putExtra("loggedInUser", myUser);
        startActivity(intent);
    }

    private void showEditTitleDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Edit Title");

        final EditText input = new EditText(this);
        input.setText(videoTitle);
        builder.setView(input);

        builder.setPositiveButton("Save", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                videoTitle = input.getText().toString();
                title.setText(videoTitle);
               currentVideo.setTitle(videoTitle);
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


    private void showEditDesDialog(TextView desc) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Edit Description");

        final EditText input = new EditText(this);
        input.setText(currentVideo.getDescription());
        builder.setView(input);

        builder.setPositiveButton("Save", new DialogInterface.OnClickListener() {

            @Override
            public void onClick(DialogInterface dialog, int which) {
                String desTitle = input.getText().toString();
                currentVideo.setDescription(desTitle);
                desc.setText(desTitle);
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

    public static Bitmap getCircularBitmap(Bitmap bitmap) {
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



}
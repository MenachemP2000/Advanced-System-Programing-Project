package com.example.aspp;

import static com.example.aspp.Utils.getPath;
import static com.example.aspp.Utils.string2drawbleId;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;

import androidx.activity.EdgeToEdge;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.aspp.objects.Video;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class VideoDetailsActivity extends AppCompatActivity {

    Button createVideo, cancel;
    EditText videoTitle, videoDescription, videoTags;
    ImageView videoThumbnail;
    Uri uri;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_video_details);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        String videoPath = getIntent().getStringExtra("videoPath");
        videoThumbnail = findViewById(R.id.thumbnail);
        videoThumbnail.setOnClickListener(v -> {
            Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            intent.setType("image/*");
            startActivityForResult(intent, 100);
                });
        videoTitle = findViewById(R.id.title);
        videoDescription = findViewById(R.id.description);
        videoTags = findViewById(R.id.tags);
        createVideo = findViewById(R.id.create);
        createVideo.setOnClickListener(v -> {
            String title = videoTitle.getText().toString();
            String description = videoDescription.getText().toString();
            String tags = videoTags.getText().toString();
            boolean isValid = true;
            if (title.isEmpty()) {
                isValid = false;
                videoTitle.setError("Title is required");
            }
            if (description.isEmpty()) {
                isValid = false;
                videoDescription.setError("Description is required");
            }
            if (tags.isEmpty()) {
                isValid = false;
                videoTags.setError("Tags are required");
            }
            if (!isValid) {
                return;
            }
            Video newVideo = new Video("demi user", 0.0,title,
                    description, tags, uri, videoPath);
            //TODO: Add video to database
                });
        cancel = findViewById(R.id.cancel);
        cancel.setOnClickListener(v -> {
            finish();
        });
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK){
            if (requestCode == 100){
                uri = data.getData();
                Bitmap bitmap = null;
                Bitmap decoded = null;
                try {
                    bitmap = MediaStore.Images.Media.getBitmap(this.getContentResolver(), uri);
                    ByteArrayOutputStream out = new ByteArrayOutputStream();
                    bitmap.compress(Bitmap.CompressFormat.PNG, 10, out);
                    decoded = BitmapFactory.decodeStream(new ByteArrayInputStream(out.toByteArray()));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
                videoThumbnail.setImageBitmap(decoded);
            }
        }
    }
}
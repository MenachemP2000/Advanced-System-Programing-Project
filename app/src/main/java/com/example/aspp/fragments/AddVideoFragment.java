package com.example.aspp.fragments;

import static android.app.Activity.RESULT_OK;

import static com.example.aspp.Utils.getPath;

import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Bundle;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;

import android.provider.MediaStore;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.example.aspp.MainActivity;
import com.example.aspp.R;
import com.example.aspp.objects.User;
import com.example.aspp.objects.Video;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link AddVideoFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class AddVideoFragment extends Fragment {
    Button createVideo, cancel;
    EditText videoTitle, videoDescription, videoTags;
    ImageView videoThumbnail;
    Uri uri;
    boolean photoWasSelected = false;
    String videoPath;

    private User myUser;
    private final ActivityResultLauncher<String> activityResultLauncher = registerForActivityResult(new ActivityResultContracts.RequestPermission(), result -> {
        if (ActivityCompat.checkSelfPermission(getContext(), android.Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
            showBottomDialog(getContext());
        }
    });   // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER

    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public AddVideoFragment() {
        // Required empty public constructor
    }

    public AddVideoFragment(User user) {
        this.myUser = user;
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment AddVideoFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static AddVideoFragment newInstance(String param1, String param2) {
        AddVideoFragment fragment = new AddVideoFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_add_video, container, false);

        if (ActivityCompat.checkSelfPermission(getContext(), android.Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            activityResultLauncher.launch(android.Manifest.permission.CAMERA);
        } else {
            showBottomDialog(getContext());
        }

        videoThumbnail = view.findViewById(R.id.thumbnail);
        videoThumbnail.setOnClickListener(v -> {
            Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            intent.setType("image/*");
            startActivityForResult(intent, 100);
        });
        videoTitle = view.findViewById(R.id.title);
        videoDescription = view.findViewById(R.id.description);
        videoTags = view.findViewById(R.id.tags);
        createVideo = view.findViewById(R.id.create);
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

            if (!photoWasSelected) {
                isValid = false;
                Toast.makeText(getContext(), "Thumbnail image is require, click on the lens icon", Toast.LENGTH_LONG).show();
            }
            if (!isValid) {
                return;
            }
            Video newVideo = new Video(Integer.parseInt(myUser.getId()), myUser.getUsername(), 0.0,title,
                    description, tags, uri, videoPath, myUser);
            HomeFragment.videoArrayList.add(newVideo);
            HomeFragment.adp.notifyDataSetChanged();
            Intent intent = new Intent(requireContext(), MainActivity.class);
            intent.putExtra("loggedInUser", myUser);
            startActivity(intent);
        });
        cancel = view.findViewById(R.id.cancel);
        cancel.setOnClickListener(v -> {
            Intent intent = new Intent(requireContext(), MainActivity.class);
            intent.putExtra("loggedInUser", myUser);
            startActivity(intent);
        });

        SharedPreferences sp = getContext().getSharedPreferences("MODE", Context.MODE_PRIVATE);
        boolean nightMode = sp.getBoolean("night", false);
        if (nightMode) {
            createVideo.setBackgroundTintList(getContext().getColorStateList(R.color.colorOnSurface_night));
            cancel.setBackgroundTintList(getContext().getColorStateList(R.color.colorOnSurface_night));
        }
        else {
            createVideo.setBackgroundTintList(getContext().getColorStateList(R.color.colorOnSurface_day));
            cancel.setBackgroundTintList(getContext().getColorStateList(R.color.colorOnSurface_day));
        }
        return view;
    }

    public void showBottomDialog(Context context) {

        final Dialog dialog = new Dialog(context);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.add_video_bottom_sheet_layout);

        LinearLayout layout_camera = dialog.findViewById(R.id.layout_camera);
        layout_camera.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
                Intent intent = new Intent(MediaStore.ACTION_VIDEO_CAPTURE);
                startActivityForResult(intent, 1);
            }
        });


        LinearLayout layout_gallery = dialog.findViewById(R.id.layout_gallery);
        layout_gallery.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                dialog.dismiss();
                Intent videoIntent = new Intent(Intent.ACTION_PICK);
                videoIntent.setType("video/*");
                startActivityForResult(Intent.createChooser(videoIntent,"Select Video"),2);

            }
        });

        LinearLayout layout_return = dialog.findViewById(R.id.layout_return);
        layout_return.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
                Intent intent = new Intent(requireContext(), MainActivity.class);
                intent.putExtra("loggedInUser", myUser);
                startActivity(intent);
            }
        });

        dialog.setCancelable(false);
        dialog.show();
        dialog.getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        dialog.getWindow().getAttributes().windowAnimations = R.style.DialogAnimation;
        dialog.getWindow().setGravity(Gravity.BOTTOM);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK){
            if (requestCode == 2 || requestCode == 1) {
                videoPath = data.toURI().split(";")[0];
                Log.i("DATA", data.toURI().split(";")[0] + "  ");
            }
            if (requestCode == 100) {
                uri = data.getData();
                Bitmap bitmap = null;
                Bitmap decoded = null;
                try {
                    bitmap = MediaStore.Images.Media.getBitmap(getActivity().getContentResolver(), uri);
                    ByteArrayOutputStream out = new ByteArrayOutputStream();
                    bitmap.compress(Bitmap.CompressFormat.PNG, 10, out);
                    decoded = BitmapFactory.decodeStream(new ByteArrayInputStream(out.toByteArray()));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
                videoThumbnail.setImageBitmap(decoded);
                photoWasSelected = true;
            }
        }
    }

}
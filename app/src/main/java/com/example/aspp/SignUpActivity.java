package com.example.aspp;

import android.app.AlertDialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.FileProvider;

import com.example.aspp.objects.User;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Rect;

public class SignUpActivity extends AppCompatActivity {

    private static final int PICK_IMAGE_REQUEST = 1;
    private static final int REQUEST_IMAGE_CAPTURE = 2;

    private ImageView profile;
    private EditText name;
    private EditText username;
    private EditText password;
    private EditText repeatPassword;
    private Button signUp;

    private User newUser;

    private boolean hasProfilePicture = false;
    private String profilePictureUrl;
    private String currentPhotoPath;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_up); // Ensure the layout file is named properly

        profile = findViewById(R.id.profilepicture);
        name = findViewById(R.id.firstandlastname);
        username = findViewById(R.id.usernameText);
        password = findViewById(R.id.passwordText);
        repeatPassword = findViewById(R.id.repeatPassword);
        signUp = findViewById(R.id.signup);

        signUp.setOnClickListener(v -> isSuccessSignUp());

        profile.setOnClickListener(v -> showImageOptions());
    }

    private void showImageOptions() {
        String[] options = {"Choose from Gallery", "Take a Photo"};
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Select Profile Picture");
        builder.setItems(options, (dialog, which) -> {
            if (which == 0) {
                chooseFromGallery();
            } else if (which == 1) {
                dispatchTakePictureIntent();
            }
        });
        builder.show();
    }

    private void chooseFromGallery() {
        Intent galleryIntent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        startActivityForResult(galleryIntent, PICK_IMAGE_REQUEST);
    }

    private void dispatchTakePictureIntent() {
        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        if (takePictureIntent.resolveActivity(getPackageManager()) != null) {
            File photoFile = null;
            try {
                photoFile = createImageFile();
            } catch (IOException ex) {
                Toast.makeText(this, "Error occurred while creating the image file", Toast.LENGTH_SHORT).show();
            }
            if (photoFile != null) {
                Uri photoURI = FileProvider.getUriForFile(this,
                        "com.example.aspp.fileprovider",
                        photoFile);
                takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI);
                startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE);
            }
        }
    }

    private File createImageFile() throws IOException {
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        String imageFileName = "JPEG_" + timeStamp + "_";
        File storageDir = new File(getFilesDir(), "images");
        if (!storageDir.exists()) {
            storageDir.mkdirs();
        }
        File image = File.createTempFile(
                imageFileName,
                ".jpg",
                storageDir
        );
        currentPhotoPath = image.getAbsolutePath();
        return image;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PICK_IMAGE_REQUEST && resultCode == RESULT_OK && data != null && data.getData() != null) {
            // Load image from gallery
            Uri selectedImageUri = data.getData();
            try {
                Bitmap bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), selectedImageUri);
                Bitmap circularBitmap = getCircularBitmap(bitmap);
                profile.setImageBitmap(circularBitmap);
                profilePictureUrl = selectedImageUri.toString();
                hasProfilePicture = true;
            } catch (IOException e) {
                e.printStackTrace();
                Toast.makeText(this, "Failed to load image", Toast.LENGTH_SHORT).show();
            }
        } else if (requestCode == REQUEST_IMAGE_CAPTURE && resultCode == RESULT_OK) {
            // Load image from camera
            File imgFile = new File(currentPhotoPath);
            if (imgFile.exists()) {
                Bitmap bitmap = BitmapFactory.decodeFile(imgFile.getAbsolutePath());
                Bitmap circularBitmap = getCircularBitmap(bitmap);
                profile.setImageBitmap(circularBitmap);
                profilePictureUrl = Uri.fromFile(imgFile).toString();
                hasProfilePicture = true;
            }
        }
    }

    private Bitmap getCircularBitmap(Bitmap squareBitmap) {
        int width = squareBitmap.getWidth();
        int height = squareBitmap.getHeight();

        int diameter = Math.min(width, height);
        Bitmap output = Bitmap.createBitmap(diameter, diameter, Bitmap.Config.ARGB_8888);

        Canvas canvas = new Canvas(output);

        final Paint paint = new Paint();
        final Rect rect = new Rect(0, 0, diameter, diameter);

        paint.setAntiAlias(true);
        canvas.drawARGB(0, 0, 0, 0);
        canvas.drawCircle(diameter / 2f, diameter / 2f, diameter / 2f, paint);

        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_IN));
        canvas.drawBitmap(squareBitmap, rect, rect, paint);

        return output;
    }

    private void isSuccessSignUp() {
        String user = username.getText().toString().trim();
        String password1 = password.getText().toString().trim();
        String fullName = name.getText().toString().trim();
        if (attemptSignUp()) {
            newUser = new User(user, password1, fullName, profilePictureUrl);
            saveUserToJson(newUser);
            navigateToSignInScreen();
        }
    }

    private boolean attemptSignUp() {
        String user = username.getText().toString().trim();
        String password1 = password.getText().toString().trim();
        String password2 = repeatPassword.getText().toString().trim();
        String fullName = name.getText().toString().trim();
        if (fullName.isEmpty() || user.isEmpty() || password1.isEmpty() || password2.isEmpty()) {
            Toast.makeText(this, "All fields must be filled", Toast.LENGTH_SHORT).show();
            return false;
        }
        if(!validUsername(user)){
            return false;
        }

        if (!checkPasswordLength(password1)) {
            return false;
        }

        if (!checkPasswordMatch(password1, password2)) {
            return false;
        }

        if (!isPasswordValid(password1)) {
            return false;
        }

        if (!hasProfilePicture) {
            Toast.makeText(this, "Please select a profile picture", Toast.LENGTH_SHORT).show();
            return false;
        }
        return true;
    }

    private boolean checkPasswordLength(String password1) {
        if (password1.length() < 8) {
            Toast.makeText(this, "Your password must contain at least 8 characters", Toast.LENGTH_SHORT).show();
            return false;
        }
        return true;
    }

    private boolean checkPasswordMatch(String password, String repeatPassword) {
        if (!password.equals(repeatPassword)) {
            Toast.makeText(this, "Your passwords don't match", Toast.LENGTH_SHORT).show();
            return false;
        }
        return true;
    }

    private boolean isPasswordValid(String password) {
        String regex = "^(?=.*\\d)(?=.*\\W).*$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(password);
        if (!matcher.matches()) {
            Toast.makeText(this, "Your password must contain characters and numbers", Toast.LENGTH_SHORT).show();
            return false;
        }
        return true;
    }

    private void navigateToSignInScreen() {
        Intent intent = new Intent(this, SignInActivity.class);
        startActivity(intent);
        finish();
    }

    private void saveUserToJson(User user) {
        try {
            File file = new File(getFilesDir(), "user_credentials.json");
            JSONArray jsonArray;

            // Read existing JSON array from file if it exists
            if (file.exists()) {
                StringBuilder json = new StringBuilder();
                BufferedReader br = new BufferedReader(new FileReader(file));
                String line;
                while ((line = br.readLine()) != null) {
                    json.append(line).append('\n');
                }
                br.close();
                jsonArray = new JSONArray(json.toString());
            } else {
                jsonArray = new JSONArray(); // Create new JSON array if file doesn't exist
            }

            // Create JSON object for the new user
            JSONObject userObject = new JSONObject();
            userObject.put("id", newUser.getId());
            userObject.put("Full Name", newUser.getFullName());
            userObject.put("username", newUser.getUsername());
            userObject.put("date of join", newUser.getDateOfJoin().toString());
            userObject.put("password", newUser.getPassword());
            userObject.put("photo", newUser.getProfilePictureUri());

            // Add the user object to the JSON array
            jsonArray.put(userObject);

            // Write the updated JSON array back to the file
            OutputStreamWriter writer = new OutputStreamWriter(new FileOutputStream(file));
            writer.write(jsonArray.toString());
            writer.close();
            Log.d("SignUpActivity", "User data saved: " + userObject.toString());
        } catch (IOException | JSONException e) {
            e.printStackTrace();
            Log.e("SignUpActivity", "Error saving user data: " + e.getMessage());
        }
    }

    private boolean validUsername(String username) {
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

            // Log file content


            JSONArray jsonArray = new JSONArray(json.toString());
            // Log the entered username and password for debugging
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject user = jsonArray.getJSONObject(i);
                String storedUsername = user.getString("username");
                if (username.trim().equals(storedUsername)) {
                    Toast.makeText(this, "Username already exists, Please choose another username", Toast.LENGTH_SHORT).show();
                    return false;
                }
            }
        } catch (IOException | JSONException e) {
            e.printStackTrace();
        }
        return true;
    }

    public void onBackPressed() {
        super.onBackPressed();
        finish();
    }
}

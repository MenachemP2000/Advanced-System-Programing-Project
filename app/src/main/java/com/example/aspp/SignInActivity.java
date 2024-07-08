package com.example.aspp;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.example.aspp.objects.User;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public class SignInActivity extends AppCompatActivity {

    private static final int REQUEST_PERMISSION_CODE = 123;
    private static final int REQUEST_CAMERA_PERMISSION_CODE = 456;
    private static final String TAG = "SignInActivity";

    private EditText usernameEditText;
    private EditText passwordEditText;

    private User myUser;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_in);

        usernameEditText = findViewById(R.id.usernameText);
        passwordEditText = findViewById(R.id.passwordText);

        Button loginBtn = findViewById(R.id.login);
        loginBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String username = usernameEditText.getText().toString().trim();
                String password = passwordEditText.getText().toString().trim();

                if (isValidCredentials(username, password)) {
                    if (myUser != null) {
                        Intent intent = new Intent(SignInActivity.this, MainActivity.class);
                        intent.putExtra("loggedInUser", myUser);
                        startActivity(intent);
                    } else {
                        Log.e(TAG, "User object is null after validation.");
                        Toast.makeText(SignInActivity.this, "An error occurred. Please try again.", Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Toast.makeText(SignInActivity.this, "Invalid username or password", Toast.LENGTH_SHORT).show();
                }
            }
        });

        TextView signUp = findViewById(R.id.signup);
        signUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                goToSignUp();
            }
        });

        // Request external storage and camera permission if not granted
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.READ_EXTERNAL_STORAGE},
                        REQUEST_PERMISSION_CODE);
            }
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.CAMERA},
                        REQUEST_CAMERA_PERMISSION_CODE);
            }
        }
    }

    private boolean isValidCredentials(String username, String password) {
        boolean isValid = false;

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
            Log.d(TAG, "File content: " + json.toString());

            // Convert the JSON string to JSONObject and check credentials
            Log.d(TAG, json.toString());
            JSONArray jsonArray = new JSONArray(json.toString());

            // Log the entered username and password for debugging
            Log.d(TAG, "Entered username: " + username + ", Entered password: " + password);

            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject user = jsonArray.getJSONObject(i);
                String storedUsername = user.getString("username");
                String storedPassword = user.getString("password");

                // Log the stored username and password for debugging
                Log.d(TAG, "Stored username: " + storedUsername + ", Stored password: " + storedPassword);

                // Check if the entered credentials match (case-sensitive and trimmed)
                if (username.trim().equals(storedUsername) && password.equals(storedPassword)) {
                    Log.d(TAG, "Credentials matched. Creating user object.");
                    this.myUser = new User(
                            user.getString("username"),
                            user.getString("password"),
                            user.getString("Full Name"),
                            user.getString("photo"),
                            user.getString("id")
                    );
                    Log.d(TAG, "User object created: ");
                    isValid = true;
                    break;
                }
            }
        } catch (IOException | JSONException e) {
            e.printStackTrace();
        }
        return isValid;
    }

    private void goToSignUp() {
        Intent intent = new Intent(this, SignUpActivity.class);
        startActivity(intent);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_PERMISSION_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "External storage permission granted", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "External storage permission denied", Toast.LENGTH_SHORT).show();
            }
        } else if (requestCode == REQUEST_CAMERA_PERMISSION_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "Camera permission granted", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "Camera permission denied", Toast.LENGTH_SHORT).show();
            }
        }
    }

    public void onBackPressed() {
        super.onBackPressed();
        finish();
    }
}

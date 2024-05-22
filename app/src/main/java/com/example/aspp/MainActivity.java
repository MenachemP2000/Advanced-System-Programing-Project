package com.example.aspp;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;

import com.example.aspp.fragments.ActiveSurveysFragment;
import com.example.aspp.fragments.AvailableSurveysFragment;
import com.example.aspp.fragments.ProfileFragment;
import com.example.aspp.databinding.ActivityMainBinding;

public class MainActivity extends AppCompatActivity {

    ActivityMainBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.bottomNavbar.getMenu().findItem(R.id.ava_surveys).setChecked(true);

        switchFragment(new AvailableSurveysFragment());

        binding.bottomNavbar.setOnItemSelectedListener(item -> {

            if (item.getItemId() == R.id.ava_surveys){
                switchFragment(new AvailableSurveysFragment());

            } else if (item.getItemId() == R.id.my_surveys) {
                switchFragment(new ActiveSurveysFragment());

            } else {
                switchFragment(new ProfileFragment());
            }
            return true;
        });
    }

    private void switchFragment(Fragment f){

        FragmentManager fm = getSupportFragmentManager();
        fm.beginTransaction()
                .replace(R.id.fragmentContainer, f, null)
                .commit();
    }

}
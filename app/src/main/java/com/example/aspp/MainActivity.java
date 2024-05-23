package com.example.aspp;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.FragmentManager;

import com.example.aspp.fragments.ShortsFragment;
import com.example.aspp.fragments.HomeFragment;
import com.example.aspp.fragments.ProfileFragment;
import com.example.aspp.databinding.ActivityMainBinding;
import com.example.aspp.fragments.SubscriptionsFragment;

public class MainActivity extends AppCompatActivity {

    ActivityMainBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.bottomNavbar.getMenu().findItem(R.id.home).setChecked(true);

        switchFragment(new HomeFragment());

        binding.bottomNavbar.setOnItemSelectedListener(item -> {

            if (item.getItemId() == R.id.home){
                switchFragment(new HomeFragment());

            } else if (item.getItemId() == R.id.shorts) {
                switchFragment(new ShortsFragment());

            }
            else if (item.getItemId() == R.id.subscriptions) {
                switchFragment(new SubscriptionsFragment());

            }
            else {
                switchFragment(new ProfileFragment());
            }
            return true;
        });
    }

    private void switchFragment(androidx.fragment.app.Fragment f){

        FragmentManager fm = getSupportFragmentManager();
        fm.beginTransaction()
                .replace(R.id.fragmentContainer, f, null)
                .commit();
    }

}
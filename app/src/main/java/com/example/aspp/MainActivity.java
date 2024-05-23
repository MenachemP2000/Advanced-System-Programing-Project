package com.example.aspp;

import android.app.Dialog;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.appcompat.widget.Toolbar;

import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.FragmentManager;

import com.example.aspp.fragments.ShortsFragment;
import com.example.aspp.fragments.HomeFragment;
import com.example.aspp.fragments.ProfileFragment;
import com.example.aspp.databinding.ActivityMainBinding;
import com.example.aspp.fragments.SubscriptionsFragment;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class MainActivity extends AppCompatActivity {

    ActivityMainBinding binding;
    DrawerLayout drawerLayout;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        drawerLayout = findViewById(R.id.drawer_layout);
        Toolbar toolbar = findViewById(R.id.toolbar);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.open_nav,
                R.string.close_nav);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        drawerLayout.closeDrawer(GravityCompat.START);

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
            else if (item.getItemId() == R.id.add_video) {
                //TODO intent to add video screen (or fragment)
                drawerLayout.openDrawer(GravityCompat.START);
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
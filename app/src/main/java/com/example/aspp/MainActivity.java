package com.example.aspp;

import android.app.Dialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.appcompat.widget.Toolbar;

import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;

import com.example.aspp.fragments.ShortsFragment;
import com.example.aspp.fragments.HomeFragment;
import com.example.aspp.fragments.ProfileFragment;
import com.example.aspp.databinding.ActivityMainBinding;
import com.example.aspp.fragments.SubscriptionsFragment;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;

public class MainActivity extends AppCompatActivity {

    ActivityMainBinding binding;
    DrawerLayout drawerLayout;
    NavigationView navigationView;
    Menu test;
    boolean nightMode;
    SharedPreferences sp;
    private Fragment currentFragment;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sp = getSharedPreferences("MODE", Context.MODE_PRIVATE);
        nightMode = sp.getBoolean("night",false);

        drawerLayout = findViewById(R.id.drawer_layout);
        Toolbar activtytoolbar = findViewById(R.id.toolbar);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, activtytoolbar, R.string.open_nav,
                R.string.close_nav);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        drawerLayout.closeDrawer(GravityCompat.START);
        navigationView = findViewById(R.id.nav_view);

        binding.bottomNavbar.getMenu().findItem(R.id.home).setChecked(true);

        switchFragment(new HomeFragment());
        currentFragment = new HomeFragment();

        if (nightMode){
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
            navigationView.getMenu().getItem(2).setTitle("Light mode");
            navigationView.getMenu().getItem(2).setIcon(R.drawable.baseline_light_mode_24);
            switchFragment(currentFragment);
        }

        binding.bottomNavbar.setOnItemSelectedListener(item -> {

            if (item.getItemId() == R.id.home){
                switchFragment(new HomeFragment(nightMode));
                currentFragment = new HomeFragment();

            } else if (item.getItemId() == R.id.shorts) {
                switchFragment(new ShortsFragment());
                currentFragment = new ShortsFragment();
            }
            else if (item.getItemId() == R.id.subscriptions) {
                switchFragment(new SubscriptionsFragment());
                currentFragment = new SubscriptionsFragment();
            }
            else if (item.getItemId() == R.id.add_video) {
                //TODO intent to add video screen (or fragment)
            }
            else {
                switchFragment(new ProfileFragment());
                currentFragment = new ProfileFragment();
            }
            return true;
        });


        navigationView.bringToFront();
        navigationView.setNavigationItemSelectedListener(new NavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                Log.i("MODE","on");
                if (item.getItemId() == R.id.liked_videos) {
                    //go to liked videos playlist
                }
                else if (item.getItemId() == R.id.watch_later) {
                    //go to watch later playlist
                }
                else if (item.getItemId() == R.id.mode) {
                    Log.i("MODE","on");
                    if (nightMode) {
                        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
                        sp.edit().putBoolean("night",false).apply();
                        item.setTitle("Light mode");
                        item.setIcon(R.drawable.baseline_light_mode_24);
                        switchFragment(currentFragment);
                    }
                    else {
                        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
                        sp.edit().putBoolean("night",true).apply();
                        item.setTitle("Dark mode");
                        item.setIcon(R.drawable.baseline_dark_mode_24);
                        switchFragment(currentFragment);
                    }
                }
                else {
                    //logout
                }
                return false;
            }
        });
    }

    private void switchFragment(androidx.fragment.app.Fragment f){

        FragmentManager fm = getSupportFragmentManager();
        fm.beginTransaction()
                .replace(R.id.fragmentContainer, f, null)
                .commit();
    }

}
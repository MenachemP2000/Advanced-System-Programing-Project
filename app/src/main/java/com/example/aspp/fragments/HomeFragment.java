package com.example.aspp.fragments;

import android.app.SearchManager;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.MenuItemCompat;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

import com.example.aspp.R;
import com.example.aspp.adapters.HomeRVAdapter;
import com.example.aspp.objects.Survey;
import com.example.aspp.objects.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link HomeFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class HomeFragment extends Fragment {

    RecyclerView surveyListContainer;
    HomeRVAdapter adp;
    ArrayList<Survey> surveysList;
    Toolbar toolbar;
    MenuItem menuItem;
    SearchView searchView;
    Button profileFilter, timeFilter, rewardFilter, surveyNameFilter;
    Map<String, Boolean> filters;
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public HomeFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment AvailableSurveysFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static HomeFragment newInstance(String param1, String param2) {
        HomeFragment fragment = new HomeFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        setHasOptionsMenu(true);
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public void onCreateOptionsMenu(@NonNull Menu menu, @NonNull MenuInflater inflater) {
        Log.i("TEST ONE","working");
        inflater.inflate(R.menu.search_bar, menu);
        menuItem = menu.findItem(R.id.search);
        searchView = (SearchView) MenuItemCompat.getActionView(menuItem);
        searchView.setIconified(true);
        Log.i("TEST TWO","working");
        SearchManager searchManager = (SearchManager) getActivity().getSystemService(Context.SEARCH_SERVICE);
        searchView.setSearchableInfo(searchManager.getSearchableInfo(getActivity().getComponentName()));
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                mySearch(query);
                return true;
            }

            @Override
            public boolean onQueryTextChange(String query) {
                mySearch(query);
                return true;
            }
        });
        Log.i("TEST FINAL","working");
        super.onCreateOptionsMenu(menu, inflater);
    }

    private void mySearch(String query) {
        if (query.equals("")) {
            adp = new HomeRVAdapter(getContext(), surveysList);
            surveyListContainer.setAdapter(adp);
            return;
        }
        ArrayList<Survey> updatedArr = new ArrayList<>();
        Set<Survey> updatedSet = new HashSet<>();
        if (filters.get("Author")) {
            for (Survey s : surveysList) {
                if (s.getFirst_name().startsWith(query))
                    updatedSet.add(s);
                if (s.getLast_name().startsWith(query))
                    updatedSet.add(s);
            }
        }
        if (filters.get("Length")) {
            for (Survey s : surveysList) {
                if (s.getTime() <= Integer.parseInt(query))
                    updatedSet.add(s);
            }
        }
        if (filters.get("Reward")) {
            for (Survey s : surveysList) {
                if (s.getSurvey_reward() >= Integer.parseInt(query))
                    updatedSet.add(s);
            }
        }
        if (filters.get("S_name")) {
            for (Survey s : surveysList) {
                if (s.getSurvey_name().startsWith(query))
                    updatedSet.add(s);
            }
        }
        if (updatedSet.isEmpty()) {
            Toast.makeText(getContext(), "I think you meant something else", Toast.LENGTH_LONG).show();
            return;
        }
        updatedArr.addAll(updatedSet);
        adp = new HomeRVAdapter(getContext(), updatedArr);
        surveyListContainer.setAdapter(adp);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        filters = new HashMap<>();
        filters.put("Author", false);
        filters.put("Length", false);
        filters.put("Reward", false);
        filters.put("S_name", false);
        View v = inflater.inflate(R.layout.fragment_home, container, false);

        profileFilter = v.findViewById(R.id.profile_filter);
        profileFilter.setOnClickListener(item -> {
            filters.replace("Author", !filters.get("Author"));
            if (filters.get("Author"))
                item.setBackgroundColor(Color.GRAY);
            else
                item.setBackgroundColor(getResources().getColor(R.color.blue));
        });
        timeFilter = v.findViewById(R.id.time_filter);
        timeFilter.setOnClickListener(item -> {
            filters.replace("Length", !filters.get("Length"));
            if (filters.get("Length"))
                item.setBackgroundColor(Color.GRAY);
            else
                item.setBackgroundColor(getResources().getColor(R.color.blue));
        });
        rewardFilter = v.findViewById(R.id.reward_filter);
        rewardFilter.setOnClickListener(item -> {
            filters.replace("Reward", !filters.get("Reward"));
            if (filters.get("Reward"))
                item.setBackgroundColor(Color.GRAY);
            else
                item.setBackgroundColor(getResources().getColor(R.color.blue));
        });
        surveyNameFilter = v.findViewById(R.id.survey_name_filter);
        surveyNameFilter.setOnClickListener(item -> {
            filters.replace("S_name", !filters.get("S_name"));
            if (filters.get("S_name"))
                item.setBackgroundColor(Color.GRAY);
            else
                item.setBackgroundColor(getResources().getColor(R.color.blue));
        });
        toolbar = v.findViewById(R.id.toolbar);

        AppCompatActivity activity = (AppCompatActivity) getActivity();
        activity.setSupportActionBar(toolbar);
        activity.getSupportActionBar().setTitle("");
        surveyListContainer = v.findViewById(R.id.ActiveSurveys);
        surveysList = new ArrayList<>();
        demoSurveys();
        adp = new HomeRVAdapter(getContext(), surveysList);
        surveyListContainer.setAdapter(adp);
        surveyListContainer.setLayoutManager(new LinearLayoutManager(getContext()));
        //TODO when clicking an item a dialog will pop up with details
//        CustomSurveyDialog dialog = new CustomSurveyDialog(getActivity());
//        dialog.show();
        return v;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void demoSurveys() {
        for (int i = 1; i <= 20; i++) {
            surveysList.add(
                    new Survey(i,
                            new User(
                                    "Harel", "hevrony", "self Employed",
                                    "PhD", "male", 34, null
                            ),
                            "Demo " + i, 7 * i - 3, i / 2, LocalDateTime.of(2024, 1, i, 6, 29, 30)
                    )
            );
        }
    }
}
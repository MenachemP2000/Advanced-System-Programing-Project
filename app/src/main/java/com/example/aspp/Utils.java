package com.example.aspp;

import android.content.Context;

import com.example.aspp.objects.Video;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;

public class Utils {

    public static ArrayList<Video> readVideosList(Context context) {
        BufferedReader jsonReader = new BufferedReader(new InputStreamReader(
                context.getResources().openRawResource(R.raw.video_list)));
        StringBuilder jsonBuilder = new StringBuilder();
        ArrayList<Video> result = new ArrayList<>();
        try {
            for (String line = null; (line = jsonReader.readLine()) != null;) {
                jsonBuilder.append(line).append("\n");
            }
            JSONArray videoData = new JSONArray(jsonBuilder.substring(
                    jsonBuilder.indexOf("["),jsonBuilder.indexOf("]")+1).toString());
            for (int i = 0; i < videoData.length(); i++) {
                JSONObject json_obj = videoData.getJSONObject(i);
                String publisher_id = json_obj.getString("publisher");
                double duration = json_obj.getDouble("duration");
                String title = json_obj.getString("title");
                String description = json_obj.getString("description");
                int thumbnailDrawableID = string2drawbleId(context, json_obj.getString("thumbnailID"));
                Video temp = new Video(publisher_id, duration, title, description, thumbnailDrawableID);
                result.add(temp);
            }
        } catch (JSONException | IOException e) {
            throw new RuntimeException(e);
        }
        return result;
    }

    public static int string2drawbleId(Context context, String drawableName) {
        int drawableId =
                context.getResources().getIdentifier(
                        drawableName, "drawable",
                        context.getPackageName());
        return drawableId;
    }
}

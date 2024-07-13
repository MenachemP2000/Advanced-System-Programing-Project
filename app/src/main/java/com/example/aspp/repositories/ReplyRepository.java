package com.example.aspp.repositories;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.aspp.api.ReplyAPI;
import com.example.aspp.api.UserAPI;
import com.example.aspp.dao.UserDao;
import com.example.aspp.entities.Reply;
import com.example.aspp.entities.SignedPartialReplyUpdate;
import com.example.aspp.entities.User;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

public class ReplyRepository {
    private ReplyRepository.ReplyListData repliesListData;
    private ReplyRepository.ReplyData replyData;
//    private UserDao dao;
    private ReplyAPI api;
//    private Context context;
    private String videoId, commentId;

    public ReplyRepository(String videoId, String commentId) {
//        this.context = context;
        this.commentId = commentId;
        this.videoId = videoId;
        repliesListData = new ReplyRepository.ReplyListData();
        replyData = new ReplyRepository.ReplyData();
        api= new ReplyAPI();
        api.getReplies(repliesListData, videoId, commentId);
    }

    public LiveData<List<Reply>> getReplies() {
        return repliesListData;
    }

    public LiveData<Reply> createReply(Reply newReply) {
        api.createReply(replyData, newReply,videoId,commentId);
        return replyData;
    }
    public void deleteReply(String id) {
        api.deleteReply(videoId,commentId,id);
    }
    public void partialUpdateReply(SignedPartialReplyUpdate update) {
        api.partialUpdateReply(videoId,commentId,update);
    }
    public void updateReply(Reply update) {
        api.updateReply(videoId,commentId,update);
    }

    class ReplyListData extends MutableLiveData<List<Reply>> {
        public ReplyListData() {
            super();
            //load data from db
            setValue(new LinkedList<>());
        }

        @Override
        protected void onActive() {
            super.onActive();

            new Thread(() -> {
                ReplyAPI api = new ReplyAPI();
                api.getReplies(this, videoId, commentId);
            }).start();
        }
    }

    class ReplyData extends MutableLiveData<Reply> {
        public ReplyData() {
            super();
            //load data from db
            setValue(new Reply("","","",new Date(),new LinkedList<>()));
        }

        @Override
        protected void onActive() {
            super.onActive();

//            new Thread(() -> {
//                VideoAPI api = new VideoAPI(Helper.context);
//                api.getAllVideos(this);
//            }).start();
        }
    }
}

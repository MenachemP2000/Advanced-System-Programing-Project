package com.example.aspp.viewmodels;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.aspp.entities.Reply;
import com.example.aspp.entities.SignedPartialReplyUpdate;
import com.example.aspp.entities.User;
import com.example.aspp.entities.Video;
import com.example.aspp.repositories.ReplyRepository;
import com.example.aspp.repositories.UserRepository;

import java.util.List;

public class RepliesViewModel extends ViewModel {
    private ReplyRepository repository;
    private LiveData<List<Reply>> replies;
    private LiveData<Reply> reply;

    public RepliesViewModel (String videoId, String commentId) {
        repository = new ReplyRepository(videoId, commentId);
        replies = repository.getReplies();
    }
    public LiveData<Reply> createReply(Reply newReply) {
        reply = repository.createReply(newReply);
        return reply;
    }

    public void deleteReply(String id) {
        repository.deleteReply(id);
    }
    public void partialUpdateReply(SignedPartialReplyUpdate update) {
        repository.partialUpdateReply(update);
    }
    public void updateReply(Reply update) {
        repository.updateReply(update);
    }

}

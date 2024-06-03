import React, { useState, useEffect, useRef } from 'react';
import './Comments.css';
import { v4 as uuidv4 } from 'uuid';
import Comment from './Comment';

const Comments = ({ comments, onCommentsChange }) => {
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState({});
  const [commentList, setCommentList] = useState([]);
  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);
  const commentTextareaRef = useRef(null);

  useEffect(() => {
    setCommentList(comments);
  }, [comments]);

  const handleEditComment = (commentId, content) => {
    const updatedComments = commentList.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, content };
      }
      return comment;
    });
    setCommentList(updatedComments);
    onCommentsChange(updatedComments);
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = commentList.filter(comment => comment.id !== commentId);
    setCommentList(updatedComments);
    onCommentsChange(updatedComments);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim() !== '') {
      const updatedComments = [...commentList, { id: uuidv4(), content: newComment, replies: [], user: "ghost", date: Date.now() }];
      setCommentList(updatedComments);
      setNewComment('');
      setIsCommentFormVisible(false);
      onCommentsChange(updatedComments);
    }
  };

  const handleAddReply = (e, commentId) => {
    e.preventDefault();
    const commentIndex = commentList.findIndex(comment => comment.id === commentId);
    if (commentIndex !== -1) {
      const updatedComments = [...commentList];
      const replyContent = newReply[commentId];
      if (replyContent && replyContent.trim() !== '') {
        updatedComments[commentIndex].replies.push({
          id: uuidv4(),
          user: 'User', // Set dynamically based on authentication
          content: replyContent
        });
        setCommentList(updatedComments);
        onCommentsChange(updatedComments);
        setNewReply(prevState => ({ ...prevState, [commentId]: '' }));
      }
    }
  };

  const handleEditReply = (replyId, commentId, editedContent) => {
    const commentIndex = commentList.findIndex(comment => comment.id === commentId);
    if (commentIndex !== -1) {
      const replyIndex = commentList[commentIndex].replies.findIndex(reply => reply.id === replyId);
      if (replyIndex !== -1) {
        const updatedComments = [...commentList];
        const updatedReplies = [...updatedComments[commentIndex].replies];
        updatedReplies[replyIndex] = { ...updatedReplies[replyIndex], content: editedContent };
        updatedComments[commentIndex] = { ...updatedComments[commentIndex], replies: updatedReplies };
        setCommentList(updatedComments);
        onCommentsChange(updatedComments);
      }
    }
  };

  const handleDeleteReply = (replyId, commentId) => {
    const commentIndex = commentList.findIndex(comment => comment.id === commentId);
    if (commentIndex !== -1) {
      const updatedReplies = commentList[commentIndex].replies.filter(reply => reply.id !== replyId);
      const updatedComments = [...commentList];
      updatedComments[commentIndex] = { ...updatedComments[commentIndex], replies: updatedReplies };
      setCommentList(updatedComments);
      onCommentsChange(updatedComments);
    }
  };

  const handleReplyChange = (e, commentId) => {
    const { value } = e.target;
    setNewReply(prevState => ({ ...prevState, [commentId]: value }));
  };

  const handleCancelEdit = () => {
    setNewComment('');
    setIsCommentFormVisible(false);
  };

  const handleTextareaFocus = () => {
    setIsCommentFormVisible(true);
  };

  const handleTextareaInput = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  useEffect(() => {
    if (commentTextareaRef.current) {
      commentTextareaRef.current.style.height = 'auto';
      commentTextareaRef.current.style.height = commentTextareaRef.current.scrollHeight + 'px';
    }
  }, [newComment]);

  return (
    <div className="comments-container">
      <h2>{commentList.length} Comments</h2>
      <form onSubmit={handleAddComment}>
        <textarea
          ref={commentTextareaRef}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onFocus={handleTextareaFocus}
          onInput={handleTextareaInput}
          placeholder="Add your comment..."
          className="comment-textarea"
        ></textarea>
        {isCommentFormVisible && (
          <div className="button-container">
            <button
              type="button"
              className="btn btn-primary cancel-button"
              onClick={handleCancelEdit}
              aria-label="Cancel editing"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary submit-button"
              type="submit"
              aria-label="Comment"
            >
              Comment
            </button>
          </div>
        )}
      </form>
      {commentList.map((comment, index) => (
        <Comment
          key={comment.id}
          comment={comment}
          index={index}
          handleEditComment={handleEditComment}
          handleDeleteComment={handleDeleteComment}
          handleAddReply={handleAddReply}
          handleEditReply={handleEditReply}
          handleDeleteReply={handleDeleteReply}
          handleReplyChange={handleReplyChange}
          newReply={newReply}
        />
      ))}
    </div>
  );
};

export default Comments;

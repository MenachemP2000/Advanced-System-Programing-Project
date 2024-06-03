import React, { useState, useEffect } from 'react';
import './Comments.css';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4

const Comments = ({ comments, onCommentsChange }) => {
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState({}); // State for storing new replies
  const [commentList, setCommentList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [repliesShown, setExpandedReplies] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    setCommentList(comments);
  }, [comments]);

  const handleEditComment = (commentId) => {
    const commentToEdit = commentList.find(comment => comment.id === commentId);
    if (commentToEdit) {
      setNewComment(commentToEdit.content);
      setEditingIndex(commentId);
    }
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = commentList.filter(comment => comment.id !== commentId);
    setCommentList(updatedComments);
    onCommentsChange(updatedComments);  // Notify parent component about the change
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim() !== '') {
      let updatedComments;
      if (editingIndex !== null) {
        updatedComments = commentList.map(comment => {
          if (comment.id === editingIndex) {
            return { ...comment, content: newComment };
          }
          return comment;
        });
        setEditingIndex(null);
      } else {
        updatedComments = [...commentList, { id: uuidv4(), content: newComment, replies: [], date: Date.now, user: "ghost", date: Date.now }]; // Generate a unique id
      }
      setCommentList(updatedComments);
      setNewComment('');
      onCommentsChange(updatedComments);  // Notify parent component about the change
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
          user: 'User', // You can set the user dynamically based on authentication
          content: replyContent
        });
        setCommentList(updatedComments);
        onCommentsChange(updatedComments); // Notify parent component about the change
        setNewReply(prevState => ({ ...prevState, [commentId]: '' })); // Clear the reply input
      }
    }
  };

  const handleReplyChange = (e, commentId) => {
    const { value } = e.target;
    setNewReply(prevState => ({ ...prevState, [commentId]: value }));
  };

  const toggleShowReplies = (index) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  
  const toggleReadMore = (index) => {
    setExpandedComments((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const renderComment = (comment, index) => {
    const isExpanded = expandedComments[index];
    const isShowingReplies = repliesShown[index];
    const isLongComment = comment.content.length > 100; // Adjust the character limit as needed
  
    return (
      <div className="comment" key={comment.id}>
        <p>
          @{comment.user}
          <p>
            {isExpanded || !isLongComment ? comment.content : `${comment.content.substring(0, 100)}...`}
          </p>
        </p>
        <div className="button-container">
          <button
            type="button"
            className="btn btn-primary edit-button"
            onClick={() => handleEditComment(comment.id)}
            aria-label="Edit comment"
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn-primary delete-button"
            onClick={() => handleDeleteComment(comment.id)}
            aria-label="Delete comment"
          >
            Delete
          </button>
        </div>
        {isLongComment && (
          <button className="btn btn-link" onClick={() => toggleReadMore(index)}>
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        )}
        <button className="btn btn-link" onClick={() => toggleShowReplies(index)}>
          {isShowingReplies ? 'Hide Replies' : 'Show Replies'}
        </button>
        {isShowingReplies && (
          <div className="replies">
            {comment.replies.map(reply => (
              <div key={reply.id}>
                <p>
                  @{reply.user}
                  <p>{reply.content}</p>
                </p>
              </div>
            ))}
            <form onSubmit={(e) => handleAddReply(e, comment.id)}>
              <textarea
                value={newReply[comment.id] || ''}
                onChange={(e) => handleReplyChange(e, comment.id)}
                placeholder="Reply to this comment..."
                className="reply-textarea"
              ></textarea>
              <button
                className="btn btn-primary submit-button"
                type="submit"
                aria-label="Add reply"
              >
                Add Reply
              </button>
            </form>
          </div>
        )}
      </div>
    );
  };
  

  return (
    <div className="comments-container">
      <h2>{commentList.length} Comments</h2>
      <form onSubmit={handleAddComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add your comment..."
          className="comment-textarea"
        ></textarea>
        <div className="button-container">
          {editingIndex !== null && (
            <button
              type="button"
              className="btn btn-primary cancel-button"
              onClick={() => setEditingIndex(null)}
              aria-label="Cancel editing"
            >
              Cancel
            </button>
          )}
          <button
            className="btn btn-primary submit-button"
            type="submit"
            aria-label={editingIndex !== null ? 'Update comment' : 'Add comment'}
          >
            {editingIndex !== null ? 'Update Comment' : 'Add Comment'}
          </button>
        </div>
      </form>
      {commentList.map((comment, index) => renderComment(comment, index))}
    </div>
  );
};

export default Comments;

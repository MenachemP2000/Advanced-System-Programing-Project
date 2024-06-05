import React, { useState, useEffect, useRef } from 'react';
import './Comments.css';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4
import Comment from './Comment';

const Comments = ({ comments, onCommentsChange ,isSignedIn ,users }) => {
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
    onCommentsChange(updatedComments);  // Notify parent component about the change
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = commentList.filter(comment => comment.id !== commentId);
    setCommentList(updatedComments);
    onCommentsChange(updatedComments);  // Notify parent component about the change
  };

  const handleAddComment = (e) => {
    let author = isSignedIn.username
    e.preventDefault();
    if (newComment.trim() !== '') {
      let updatedComments;
        updatedComments = [...commentList, { id: uuidv4(), content: newComment, replies: [], user: author , date: Date.now() }]; // Generate a unique id
      
      setCommentList(updatedComments);
      setNewComment('');
      setIsCommentFormVisible(false);
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
          user: isSignedIn.username, // You can set the user dynamically based on authentication
          content: replyContent
        });
        setCommentList(updatedComments);
        onCommentsChange(updatedComments); // Notify parent component about the change
        setNewReply(prevState => ({ ...prevState, [commentId]: '' })); // Clear the reply input
      }
    }
  };

  const handleEditReply = (replyId, commentId, editedContent) => {
    // Find the comment index in the commentList
    const commentIndex = commentList.findIndex(comment => comment.id === commentId);
    
    if (commentIndex !== -1) {
      // Find the reply index in the replies array of the comment
      const replyIndex = commentList[commentIndex].replies.findIndex(reply => reply.id === replyId);
      
      if (replyIndex !== -1) {
        // Create a copy of the commentList and the replies array
        const updatedComments = [...commentList];
        const updatedReplies = [...updatedComments[commentIndex].replies];
        
        // Update the content of the reply
        updatedReplies[replyIndex] = {
          ...updatedReplies[replyIndex],
          content: editedContent
        };
        
        // Update the replies array in the comment
        updatedComments[commentIndex] = {
          ...updatedComments[commentIndex],
          replies: updatedReplies
        };
        
        // Update the state with the updated commentList
        setCommentList(updatedComments);
        
        // Notify the parent component about the change if needed
        // onCommentsChange(updatedComments);
      }
    }
  };
  const handleDeleteReply = (replyId, commentId) => {
    // Find the comment index in the commentList
    const commentIndex = commentList.findIndex(comment => comment.id === commentId);
    
    if (commentIndex !== -1) {
      // Filter out the reply with the specified id from the replies array
      const updatedReplies = commentList[commentIndex].replies.filter(reply => reply.id !== replyId);
      
      // Create a copy of the commentList and update the replies array
      const updatedComments = [...commentList];
      updatedComments[commentIndex] = {
        ...updatedComments[commentIndex],
        replies: updatedReplies
      };
      
      // Update the state with the updated commentList
      setCommentList(updatedComments);
      
      // Notify the parent component about the change if needed
      // onCommentsChange(updatedComments);
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
      {(isSignedIn) && (
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
              aria-label={'Comment'}
            >
              {'Comment'}
            </button>
          </div>
        )}
      </form>
      )}
      {commentList.map((comment, index) => (
        <Comment
          users ={users}
          isSignedIn ={isSignedIn}
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
          commentList={commentList}
          onCommentsChange={onCommentsChange}
          setCommentList={setCommentList}
          users ={users}
        />
      ))}
    </div>
  );
};

export default Comments;

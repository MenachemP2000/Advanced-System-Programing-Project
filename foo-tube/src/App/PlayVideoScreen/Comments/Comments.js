import React, { useState, useEffect, useRef } from 'react';
import './Comments.css';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4
import Comment from './Comment';

const Comments = ({
  comments,
  onCommentsChange,
  isSignedIn,
  users,
  likeComment,
  unlikeComment,
  videoId,
  videos
}) => {
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState({});

  const [commentList, setCommentList] = useState([]);
  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);
  const commentTextareaRef = useRef(null);

  useEffect(() => {
    setCommentList(videos.find(video => video.id === videoId).comments);
  }, [videos, videoId]);
  

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
    let author = isSignedIn.username
    e.preventDefault();
    if (newComment.trim() !== '') {
      let updatedComments;
      updatedComments = [...commentList,{ id: uuidv4(), content: newComment, replies: [], usersLikes: [], user: author, date: Date.now() }]; 
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
          user: isSignedIn.username, // You can set the user dynamically based on authentication
          content: replyContent,
          usersLikes: []
        });
        setCommentList(updatedComments);
        onCommentsChange(updatedComments); 
        setNewReply(prevState => ({ ...prevState, [commentId]: '' })); // Clear the reply input
      }
    }
  };

  const handleEditReply = (replyId, commentId, editedContent) => {
    const commentIndex = commentList.findIndex(comment => comment.id === commentId);

    if (commentIndex !== -1) {
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

        setCommentList(updatedComments);
        onCommentsChange(updatedComments);
      }
    }
  };

  const handleEditReplyLikes = (replyId, commentId, replyLikes) => {
    const commentIndex = commentList.findIndex(comment => comment.id === commentId);

    if (commentIndex !== -1) {
      const replyIndex = commentList[commentIndex].replies.findIndex(reply => reply.id === replyId);

      if (replyIndex !== -1) {
        // Create a copy of the commentList and the replies array
        const updatedComments = [...commentList];
        const updatedReplies = [...updatedComments[commentIndex].replies];

        updatedReplies[replyIndex] = {
          ...updatedReplies[replyIndex],
          usersLikes: replyLikes
        };

        // Update the replies array in the comment
        updatedComments[commentIndex] = {
          ...updatedComments[commentIndex],
          replies: updatedReplies
        };
        console.log(updatedComments);
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
      updatedComments[commentIndex] = {
        ...updatedComments[commentIndex],
        replies: updatedReplies
      };
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
  

  const handleCommentChange = (newComment) => {
    setCommentList(prevComments => {
      const commentIndex = prevComments.findIndex(comment => comment.id === newComment.id);
    
      let updatedComments;
      if (commentIndex !== -1) { 
        updatedComments = prevComments.map((comment, index) => index === commentIndex ? newComment : comment);
      } else {
        updatedComments = [...prevComments, newComment];
      }
      onCommentsChange(updatedComments);
      
      return updatedComments; 
    });
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
          likeComment={likeComment}
          unlikeComment={unlikeComment}
          users={users}
          isSignedIn={isSignedIn}
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
          onCommentChange={handleCommentChange}
          setCommentList={setCommentList}
          videoId={videoId}
          videos={videos}
          onCommentsChange={onCommentsChange}
          handleEditReplyLikes={handleEditReplyLikes}
        />
      ))}
    </div>
  );
};

export default Comments;

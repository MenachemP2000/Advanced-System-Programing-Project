import React, { useState, useEffect, useRef } from 'react';
import './Comments.css';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4
import Comment from './Comment';

const Comments = ({
  onCommentsChange,
  isSignedIn,
  users,
  likeComment,
  unlikeComment,
  videoId,
  videos
}) => {
  const [newComment, setNewComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);
  const commentTextareaRef = useRef(null);

  useEffect(() => {
    setCommentList(videos.find(video => video.id === videoId).comments);
  }, [videos, videoId]);
  
  useEffect(() => {
    if (commentTextareaRef.current) {
      commentTextareaRef.current.style.height = 'auto';
      commentTextareaRef.current.style.height = commentTextareaRef.current.scrollHeight + 'px';
    }
  }, [newComment]);

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
      console.log(updatedComments);
      onCommentsChange(updatedComments);
      return updatedComments; 
    });
  };
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
          handleDeleteComment={handleDeleteComment}
          commentList={commentList}
          onCommentChange={handleCommentChange}
          setCommentList={setCommentList}
          videoId={videoId}
          videos={videos}
          onCommentsChange={onCommentsChange}
        />
      ))}
    </div>
  );
};

export default Comments;

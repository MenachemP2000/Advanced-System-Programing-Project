import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Comments.css';
import Comment from './Comment';

const Comments = ({
  isSignedIn,
  videoId,
  onCommentsChangeOnly,
}) => {
  const [newComment, setNewComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);
  const commentTextareaRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
  }, [commentList]);

  useEffect(() => {
    getVideoComments(videoId);
  }, [videoId]);

  useEffect(() => {
    if (commentTextareaRef.current) {
      commentTextareaRef.current.style.height = 'auto';
      commentTextareaRef.current.style.height = commentTextareaRef.current.scrollHeight + 'px';
    }
  }, [newComment]);
  
  const getVideoComments= async (videoId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/videos/${videoId}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch video comments');
      }
      const videoCommentsFromServer = await response.json();
      setCommentList(videoCommentsFromServer);
    } catch (error) {
      console.error('Error fetching video comments:', error);
    }
  };

  const addComment = async (comment) => {
    try {
      const response = await fetch(`http://localhost:4000/api/videos/${videoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      });
      if (!response.ok) {
        throw new Error('Failed to add new comment');
      }
      const newCommentFromServer = await response.json();
      setCommentList(prevComments => [...prevComments, newCommentFromServer]);
    } catch (error) {
      console.error('Error adding new comment:', error);
    }
  };
  const handleAddComment = async (e) => {
    e.preventDefault();
    let author = isSignedIn.username;
    const commentToAdd = { content: newComment, replies: [], usersLikes: [], user: author, date: Date.now() }

    try {
      await addComment(commentToAdd);
    } catch (error) {
      console.error('Error Adding comment:', error);
    }
    setIsCommentFormVisible(false);
    setNewComment('');
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = commentList.filter(comment => comment._id !== commentId);
    setCommentList(updatedComments);
    onCommentsChangeOnly(updatedComments);
  };


  const handleCancelEdit = () => {
    setNewComment('');
    setIsCommentFormVisible(false);
  };

  const handleTextareaFocus = () => {
    if (isSignedIn) {
      setIsCommentFormVisible(true);

    }
    else {
      navigate('/signin');
    }
  };

  const handleTextareaInput = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleCommentChange = (newComment) => {
    setCommentList(prevComments => {
      const commentIndex = prevComments.findIndex(comment => comment._id === newComment._id);

      let updatedComments;
      if (commentIndex !== -1) {
        updatedComments = prevComments.map((comment, index) => index === commentIndex ? newComment : comment);
      } else {
        updatedComments = [...prevComments, newComment];
      }
      onCommentsChangeOnly(updatedComments);
      return updatedComments;
    });
  };

  return (
    <div className="comments-container">
      <h2>{commentList.length} Comments</h2>
      {(isSignedIn) && (
        <>
          <div className='newComment'>
            <div><img src={isSignedIn.image} height="50px" width="50px" ></img></div>
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
                    className="btn "
                    onClick={handleCancelEdit}
                    aria-label="Cancel editing"
                  >
                    Cancel
                  </button>
                  <button
                    className="btn"
                    type="submit"
                    aria-label={'Comment'}
                  >
                    {'Comment'}
                  </button>
                </div>
              )}
            </form>


          </div>

        </>
      )}
      {(!isSignedIn) && (
        <>
          <div className='newComment'>
            <div><img className='profilePic' src="/pictures/users/notSignedin.jpg" height="50px" width="50px" ></img></div>
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
            </form>
          </div>
        </>
      )}
      {commentList.map((comment) => (
        <Comment
          isSignedIn={isSignedIn}
          key={comment._id}
          comment={comment}
          handleDeleteComment={handleDeleteComment}
          onCommentChange={handleCommentChange}
          videoId={videoId}
        />
      ))}
    </div>
  );
};

export default Comments;

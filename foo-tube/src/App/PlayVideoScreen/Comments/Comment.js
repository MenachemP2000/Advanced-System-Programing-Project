// Comment.js
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Reply from './Reply'; // Import Reply component
import './Comment.css';

const Comment = ({
  comment,
  handleEditComment,
  handleDeleteComment,
  handleAddReply,
  handleDeleteReply,
  handleEditReply,
  handleReplyChange,
  newReply,
  commentList,
  onCommentsChange,
  setCommentList,
  isSignedIn,
  users
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShowingReplies, setIsShowingReplies] = useState(false);
  const [isReplyFormVisible, setIsReplyFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [replyLikes, setReplyLikes] = useState({});
  const [userLikedReplies, setUserLikedReplies] = useState({});
  const [author, setAuthor] = useState(null);
  const editTextareaRef = useRef(null);
  const [commentLikes, setCommentLikes] = useState(0);
  const [userLikedComment, setUserLikedComment] = useState(false);
  const [usersLikedComment, setUsersLikedComment] = useState([]);

  useEffect(() => {
    if (isEditing && editTextareaRef.current) {
      editTextareaRef.current.style.height = 'auto';
      editTextareaRef.current.style.height = editTextareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing, editContent]);

  useEffect(() => {
    if (comment.usersLiked) {
      setUsersLikedComment(comment.usersLiked);
    }
  }, [comment]);

  useEffect(() => {
    if (usersLikedComment.includes(isSignedIn)) {
      setUserLikedComment(true);
    }
    else {
      setUserLikedComment(false);
    }
    setCommentLikes(usersLikedComment.length)
  }, [comment, usersLikedComment, isSignedIn]);


  useEffect(() => {
    // Initialize userLikedReplies state for each reply
    const initialUserLikedReplies = {};
    comment.replies.forEach(reply => {
      initialUserLikedReplies[reply.id] = false;
    });

    setAuthor(users.find(author => author.username === comment.user));
    setUserLikedReplies(initialUserLikedReplies);
  }, [comment.replies]);

  const toggleShowReplies = () => {
    setIsShowingReplies(!isShowingReplies);
  };

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const showReplyForm = () => {
    setIsReplyFormVisible(true);
  };

  const hideReplyForm = () => {
    if (isReplyFormVisible) {
      handleReplyChange({ target: { value: '' } }, comment.id);
    }
    setIsReplyFormVisible(!isReplyFormVisible);
  };

  const handleSaveEdit = () => {
    handleEditComment(comment.id, editContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleEditContentChange = (e) => {
    setEditContent(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleReplyContentChange = (e) => {
    handleReplyChange(e, comment.id);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleReply = (e) => {
    e.preventDefault();
    handleAddReply(e, comment.id);
    hideReplyForm();
  };

  const handleLikeComment = () => {
    setUsersLikedComment(prevUsersLikedComment => {
      return [...prevUsersLikedComment, isSignedIn];
    });
  };

  const handleUnlikeComment = () => {
    setUsersLikedComment(prevUsersLikedComment => {
      return prevUsersLikedComment.filter(user => user !== isSignedIn);
    });
  };

  const handleLikeReply = (replyId) => {
    setUserLikedReplies(prevUserLikedReplies => ({
      ...prevUserLikedReplies,
      [replyId]: true,
    }));
    setReplyLikes(prevLikes => ({
      ...prevLikes,
      [replyId]: (prevLikes[replyId] || 0) + 1,
    }));
  };

  const handleUnlikeReply = (replyId) => {
    setUserLikedReplies(prevUserLikedReplies => ({
      ...prevUserLikedReplies,
      [replyId]: false,
    }));
    setReplyLikes(prevLikes => ({
      ...prevLikes,
      [replyId]: Math.max((prevLikes[replyId] || 0) - 1, 0),
    }));
  };

  const handleSendDeleteReply = (replyId) => {
    handleDeleteReply(replyId, comment.id);
  };
  const handleSendAddReply = (replyId) => {
    handleAddReply(replyId, comment.id);
  };
  const handleSendEditReply = (replyId, editedContent) => {
    handleEditReply(replyId, comment.id, editedContent);
  };

  const isLongComment = comment.content.length > 100;

  return (
    <div id="outercomment">
      {author && (
        <div><img src={author.image} height="50px" width="50px" ></img></div>
      )}

      <div className="comment" id="innercomment" key={comment.id}>
        <div>@{comment.user}</div>
        {isEditing ? (
          <div>
            <textarea
              ref={editTextareaRef}
              value={editContent}
              onChange={handleEditContentChange}
              className="edit-textarea"
            />
            <div className="button-container">
              <button
                type="button"
                className="btn btn-primary save-button"
                onClick={handleSaveEdit}
                aria-label="Save edit"
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-primary cancel-button"
                onClick={handleCancelEdit}
                aria-label="Cancel edit"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p>{isExpanded || !isLongComment ? comment.content : `${comment.content.substring(0, 100)}...`}</p>
        )}
        <div className="button-container">
          {(!isEditing && (comment.user == isSignedIn.username)) && (
            <>
              <button
                type="button"
                className="btn btn-primary edit-button"
                onClick={() => setIsEditing(true)}
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
            </>
          )}
        </div>
        {isLongComment && (
          <button className="btn btn-link" onClick={toggleReadMore}>
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        )}
        <div>
          {isSignedIn && (
            <button className="btn btn-link" onClick={showReplyForm}>
              {'Reply'}
            </button>
          )}
          {(isSignedIn && userLikedComment) && (
            <button className="btn btn-primary" onClick={handleUnlikeComment}>
              {commentLikes} Unlike
            </button>
          )}
          
          {(isSignedIn && !userLikedComment) && (
            <button className="btn btn-primary" onClick={handleLikeComment}>
              {commentLikes} Like
            </button>
          )}
        </div>
        {isReplyFormVisible && (
          <form onSubmit={handleReply}>
            <textarea
              value={newReply[comment.id] || ''}
              onChange={handleReplyContentChange}
              placeholder="Reply to this comment..."
              className="reply-textarea"
            ></textarea>
            <div className="button-container">
              <button className="btn btn-primary cancel-button" onClick={hideReplyForm}>
                {'Cancel'}
              </button>
              <button
                className="btn btn-primary submit-button"
                type="submit"
                aria-label="Add reply"
              >
                Reply
              </button>
            </div>
          </form>
        )}
        <div>
          {comment.replies.length > 0 && (
            <button className="btn btn-link" onClick={toggleShowReplies}>
              {isShowingReplies ? '^ ' + comment.replies.length + ' replies' : '˅ ' + comment.replies.length + ' replies'}
            </button>
          )}
        </div>
        <div className={`replies ${isShowingReplies ? 'show' : 'hide'}`}>
          {comment.replies.map(reply => (
            <Reply
              key={reply.id}
              reply={reply}
              handleLikeReply={handleLikeReply}
              handleUnlikeReply={handleUnlikeReply}
              handleAddReply={handleSendAddReply}
              handleEditReply={handleSendEditReply}
              handleDeleteReply={handleSendDeleteReply}
              handleReplyChange={handleReplyChange}
              userLikedReply={userLikedReplies[reply.id]}
              replyLikes={replyLikes[reply.id] || 0}
              comment={comment}
              newReply={newReply}
              handleReplyContentChange={handleReplyContentChange}
              commentList={commentList}
              onCommentsChange={onCommentsChange}
              setCommentList={setCommentList}
              isSignedIn={isSignedIn}
              users={users}

            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comment;

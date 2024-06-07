// Comment.js
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Reply from './Reply'; // Import Reply component
import './Comment.css';

const Comment = ({
  key,
  comment,
  handleDeleteComment,
  commentList,
  onCommentChange,
  setCommentList,
  isSignedIn,
  users,
  onCommentsChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShowingReplies, setIsShowingReplies] = useState(false);
  const [isReplyFormVisible, setIsReplyFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [author, setAuthor] = useState(null);
  const editTextareaRef = useRef(null);
  const [newReply, setNewReply] = useState({});

  const [thisComment, setThisComment] = useState(comment);
  const [usersLikedComment, setUsersLikedComment] = useState([]);
  const [userLikedComment, setUserLikedComment] = useState(false);
  const [totalUserLikes, setTotaluserLikes] = useState(0);
  const [currentCommentReplies, setCurrentCommentReplies] = useState([]);
  const [currentCommentRepliesLength, setCurrentCommentRepliesLength] = useState(0);

  useEffect(() => {
    if (isEditing && editTextareaRef.current) {
      editTextareaRef.current.style.height = 'auto';
      editTextareaRef.current.style.height = editTextareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing, editContent]);

  useEffect(() => {
    const fetchComment = () => {
      const currentComment = commentList.find(c => c.id === key);
      if (currentComment) {
        setThisComment(currentComment);
        setUsersLikedComment(currentComment.usersLikes);
        setTotaluserLikes(usersLikedComment.length || 0);
        setCurrentCommentReplies(currentComment.replies);
        setCurrentCommentRepliesLength(currentCommentReplies.length || 0);
        setAuthor(users.find(author => author.username === currentComment.username));
      }
      if (usersLikedComment && usersLikedComment.length > 0 && usersLikedComment.find(user => user === isSignedIn.username)) {
        setUserLikedComment(true);
      } else {
        setUserLikedComment(false);
      }
    };
    fetchComment();
  }, [key, users]);

  useEffect(() => {
    setUsersLikedComment(thisComment.usersLikes);
    setTotaluserLikes(usersLikedComment.length);
  }, [thisComment, usersLikedComment]);

  useEffect(() => {
    setCurrentCommentReplies(thisComment.replies);
  }, [thisComment]);

  useEffect(() => {
    setCurrentCommentRepliesLength(currentCommentReplies.length);
  }, [currentCommentReplies]);

  useEffect(() => {
    if (usersLikedComment && usersLikedComment.length > 0 && usersLikedComment.find(user => user === isSignedIn.username)) {
      setUserLikedComment(true);
    } else {
      setUserLikedComment(false);
    }
  }, [isSignedIn, thisComment, usersLikedComment]);


  const handleLikeComment = () => {
    const newUsersLikes = [...thisComment.usersLikes, isSignedIn.username];
    let updatedComment = { ...thisComment, usersLikes: newUsersLikes };
    setThisComment(updatedComment);
    onCommentChange(updatedComment);
  };

  const handleUnlikeComment = () => {
    const newUsersLikes = thisComment.usersLikes.filter(user => user !== isSignedIn.username);
    const updatedComment = { ...thisComment, usersLikes: newUsersLikes };
    setThisComment(updatedComment);
    onCommentChange(updatedComment);
  };

  useEffect(() => {
    setAuthor(users.find(author => author.username === comment.user));
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

  const handleEditComment = (editContent) => {
    const updatedComment = {
      ...thisComment,
      content: editContent
    };
    setThisComment(updatedComment);
    onCommentChange(updatedComment);
  };


  const handleSaveEdit = () => {
    handleEditComment(editContent);
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

  const handleReplyChange = (e, commentId) => {
    const { value } = e.target;
    setNewReply(prevState => ({ ...prevState, [commentId]: value }));
  };


  const handleCommentReplyChange = (newReply) => {
    setCurrentCommentReplies(prevReplies => {
      // Find the index of the reply to be updated
      const replyIndex = prevReplies.findIndex(reply => reply.id === newReply.id);

      let updatedReplies;
      if (replyIndex !== -1) {
        updatedReplies = prevReplies.map((reply, index) => index === replyIndex ? newReply : reply);
      } else {
        updatedReplies = [...prevReplies, newReply];
      }

      const updatedComment = {
        ...thisComment,
        replies: updatedReplies
      };
      setThisComment(updatedComment);
      onCommentChange(updatedComment);

      return updatedReplies;
    });
  };

  const handleAddReply = (e, commentId) => {
    e.preventDefault();
    const replyContent = newReply[commentId];
    if (replyContent && replyContent.trim() !== '') {
      const newReplyObject = {
        id: uuidv4(),
        user: isSignedIn.username,
        content: replyContent,
        usersLikes: []
      };
      const updatedReplies = [...thisComment.replies, newReplyObject];
      const updatedComment = {
        ...thisComment,
        replies: updatedReplies
      };
      setThisComment(updatedComment);
      onCommentChange(updatedComment);
      setNewReply(prevState => ({ ...prevState, [commentId]: '' }));
    }
  };

  const handleDeleteReply = (replyId) => {
    const updatedReplies = thisComment.replies.filter(reply => reply.id !== replyId);
    const updatedComment = {
      ...thisComment,
      replies: updatedReplies
    };
    setThisComment(updatedComment);
    onCommentChange(updatedComment);
  };
  const handleEditReply = (replyId, editedContent) => {
    if (editedContent && editedContent.trim() !== '') {
      const updatedReplies = thisComment.replies.map(reply =>
        reply.id === replyId ? { ...reply, content: editedContent } : reply
      );
      const updatedComment = {
        ...thisComment,
        replies: updatedReplies
      };
      setThisComment(updatedComment);
      onCommentChange(updatedComment);
    }
  };
  const handleReply = (e) => {
    e.preventDefault();
    handleAddReply(e, comment.id);
    hideReplyForm();
  };

  const handleSendDeleteReply = (replyId) => {
    handleDeleteReply(replyId);
  };

  const handleSendAddReply = (replyId) => {
    handleAddReply(replyId, comment.id);
  };
  const handleSendEditReply = (replyId, editedContent) => {
    handleEditReply(replyId, editedContent);
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
              {totalUserLikes} Unlike
            </button>
          )}

          {(isSignedIn && !userLikedComment) && (
            <button className="btn btn-primary" onClick={handleLikeComment}>
              {totalUserLikes} Like
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
          {currentCommentRepliesLength > 0 && (
            <button className="btn btn-link" onClick={toggleShowReplies}>
              {isShowingReplies ? '^ ' + comment.replies.length + ' replies' : '˅ ' + comment.replies.length + ' replies'}
            </button>
          )}
        </div>
        <div className={`replies ${isShowingReplies ? 'show' : 'hide'}`}>
          {currentCommentReplies.map(reply => (
            <Reply
              reply={reply}
              key={reply.id}
              handleAddReply={handleSendAddReply}
              handleEditReply={handleSendEditReply}
              handleDeleteReply={handleSendDeleteReply}
              handleReplyChange={handleReplyChange}
              handleCommentReplyChange={handleCommentReplyChange}
              comment={thisComment}
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

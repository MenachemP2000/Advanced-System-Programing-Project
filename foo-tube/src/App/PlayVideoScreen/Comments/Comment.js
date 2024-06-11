// Comment.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
    if (isSignedIn) {
      const newUsersLikes = [...thisComment.usersLikes, isSignedIn.username];
      let updatedComment = { ...thisComment, usersLikes: newUsersLikes };
      setThisComment(updatedComment);
      onCommentChange(updatedComment);

    }
    else{
      navigate('/signin');
    }
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
    if (isSignedIn) {
      setIsReplyFormVisible(true);
      
    }
    else{
      navigate('/signin');
    }
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
  const isLongComment = comment.content.length > 100;

  return (
    <div id="outercomment">
      {author && (
        <div><img  className='profilePic' src={author.image} height="50px" width="50px" ></img></div>
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
                className="btn"
                onClick={handleSaveEdit}
                aria-label="Save edit"
              >
                Save
              </button>
              <button
                type="button"
                className="btn"
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
        {isLongComment && (
          <button className="btn" onClick={toggleReadMore}>
            {isExpanded ? 'Show less' : '...more'}
          </button>
        )}
        <div className="button-container">
          {(!isEditing && (comment.user == isSignedIn.username)) && (
            <>
              <button
                type="button"
                className="btn"
                onClick={() => setIsEditing(true)}
                aria-label="Edit comment"
              >

                <i class="bi bi-pencil"></i>
                <span className="icon-text">Edit</span>

              </button>
              <button
                type="button"
                className="btn "
                onClick={() => handleDeleteComment(comment.id)}
                aria-label="Delete comment"
              >
                <i class="bi bi-trash"></i>
                <span className="icon-text">Delete</span>
              </button>
            </>
          )}
        </div>
        <div className='button-container-like-reply'>
          {(isSignedIn && userLikedComment) && (
            <button className="btn  " onClick={handleUnlikeComment}>
              <i class="bi bi-hand-thumbs-down"></i>
              <span className="icon-text"> {totalUserLikes}</span>
            </button>
          )}

          {((isSignedIn && !userLikedComment) || !isSignedIn) && (
            <button className="btn  " onClick={handleLikeComment}>
              <i class="bi bi-hand-thumbs-up"></i>
              <span className="icon-text"> {totalUserLikes}</span>
            </button>
          )}
          {
            <button className="btn" onClick={showReplyForm}>
              {'Reply'}
            </button>
          }
        </div>
        {isReplyFormVisible && (
          <>
            <div className='newReply'>
              <div><img  className='profilePic' src={isSignedIn.image} height="50px" width="50px" ></img></div>
              <form onSubmit={handleReply}>
                <textarea
                  value={newReply[comment.id] || ''}
                  onChange={handleReplyContentChange}
                  placeholder="Reply to this comment..."
                  className="reply-textarea"
                ></textarea>
                <div className="button-container">
                  <button className="btn " onClick={hideReplyForm}>
                    {'Cancel'}
                  </button>
                  <button
                    className="btn "
                    type="submit"
                    aria-label="Add reply"
                  >
                    Reply
                  </button>
                </div>
              </form>
            </div>

          </>
        )}
        <div>
          {currentCommentRepliesLength > 0 && (
            <button className="btn " onClick={toggleShowReplies}>
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

// Reply.js
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4
import './Reply.css'
const Reply = ({
  key,
  reply,
  handleEditReply,
  handleDeleteReply,
  comment,
  commentList,
  onCommentsChange,
  setCommentList,
  isSignedIn,
  users,
  handleCommentReplyChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(reply.content);
  const [isReplyFormVisible, setIsReplyFormVisible] = useState(false);
  const editTextareaRef = useRef(null);
  const [newReply, setNewReply] = useState({});
  const [author, setAuthor] = useState(null);

  const [thisReply, setThisReply] = useState(reply);
  const [usersLikedReply, setUsersLikedReply] = useState([]);
  const [userLikedReply, setUserLikedReply] = useState(false);
  const [totalUserLikes, setTotaluserLikes] = useState(0);




  useEffect(() => {
    if (isEditing && editTextareaRef.current) {
      editTextareaRef.current.style.height = 'auto';
      editTextareaRef.current.style.height = editTextareaRef.current.scrollHeight + 'px';
    }
    setAuthor(users.find(author => author.username === reply.user));
  }, [isEditing, editedContent]);

  
  useEffect(() => {
    const fetchReply = () => {
      const currentReply = comment.replies.find(r => r.id === key);
      if (currentReply) {
        setThisReply(currentReply);
        setUsersLikedReply(currentReply.usersLikes);
        setTotaluserLikes(usersLikedReply.length || 0);
        setAuthor(users.find(author => author.username === currentReply.username));
      }
      if (usersLikedReply && usersLikedReply.length > 0 && usersLikedReply.find(user => user === isSignedIn.username)) {
        setUserLikedReply(true);
        console.log(true);
      } else {
        setUserLikedReply(false);
        console.log(false);
      }
    };
    fetchReply();
  }, [key, users]);
  
  useEffect(() => {
    setUsersLikedReply(thisReply.usersLikes);
    if (usersLikedReply) {
      setTotaluserLikes(usersLikedReply.length);
    }
  }, [thisReply, usersLikedReply]);

  useEffect(() => {
    console.log(usersLikedReply);
    if (usersLikedReply && usersLikedReply.length > 0 && usersLikedReply.find(user => user === isSignedIn.username)) {
      setUserLikedReply(true);
    } else {
      setUserLikedReply(false);
    }
  }, [isSignedIn, thisReply, usersLikedReply]);

  const handleLikeReply = () => {
    const newUsersLikes = [...thisReply.usersLikes, isSignedIn.username];
    const updatedReply = { ...thisReply, usersLikes: newUsersLikes };
    setThisReply(updatedReply);
    handleCommentReplyChange(updatedReply);
  };

  const handleUnlikeReply = () => {
    const newUsersLikes = thisReply.usersLikes.filter(user => user !== isSignedIn.username);
    const updatedReply = { ...thisReply, usersLikes: newUsersLikes };
    setThisReply(updatedReply);
    handleCommentReplyChange(updatedReply);
  };

  const handleAddReply = (e, commentId) => {
    e.preventDefault();
    const commentIndex = commentList.findIndex(comment => comment.id === commentId);
    if (commentIndex !== -1) {
      const updatedComments = [...commentList];
      const replyContent = newReply[commentId];
      if (replyContent && replyContent.trim() !== '') {
        const newReply = {
          id: uuidv4(),
          user: isSignedIn.username, // Y
          content: replyContent,
          usersLikes: []
        }
        updatedComments[commentIndex].replies.push(newReply);
        setCommentList(updatedComments);
        onCommentsChange(updatedComments); // Notify parent component about the change
        setNewReply(prevState => ({ ...prevState, [commentId]: '' })); // Clear the reply input
      }
    }
  };

  const handleReply = (e) => {
    e.preventDefault();
    handleAddReply(e, comment.id);
    hideReplyForm();
  };

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };



  const handleReplyChange = (e, commentId) => {
    const { value } = e.target;
    setNewReply(prevState => ({ ...prevState, [commentId]: value }));
  };

  const handleReplyContentChange = (e) => {
    handleReplyChange(e, comment.id);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleEditContentChange = (e) => {
    setEditedContent(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleSaveEdit = () => {
    handleEditReply(reply.id, editedContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(reply.content);
    setIsEditing(false);
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

  const isLongReply = reply.content.length > 100;

  return (
    <div id="outerreply">
    {author && (
      <div><img src={author.image} height="50px" width="50px" ></img></div>
    )}
    <div className="reply" id="innerreply" key={reply.id}>
      {!isEditing && (<>
        <div>@{reply.user}</div>
        <div>
          <p>{isExpanded ? reply.content : reply.content.substring(0, 100)}</p>
          {isLongReply && (
            <button className="btn btn-link" onClick={toggleReadMore}>
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </div>
      </>)
      }
      {(isSignedIn.username == reply.user) && (
        <div className="button-container">

          <button className="btn btn-primary edit-button" onClick={toggleEdit}>Edit</button>
          <button className="btn btn-primary delete-button" onClick={() => handleDeleteReply(reply.id)}>Delete</button>

        </div>
      )}
      <div>
        {!isEditing && (
          <>
            {isSignedIn && (
              <button className="btn btn-link" onClick={showReplyForm}>
                {'Reply'}
              </button>
            )}
            {(isSignedIn && !userLikedReply) && (
              <button
                className="btn btn-primary like-button"
                onClick={() => handleLikeReply(reply.id)}
                aria-label="Like reply"
              >
                {totalUserLikes} Like
              </button>
            )}
            {(isSignedIn && userLikedReply) && (
              <button
                className="btn btn-primary unlike-button"
                onClick={() => handleUnlikeReply(reply.id)}
                aria-label="Unlike reply"
                >
                {totalUserLikes} Unlike
              </button>
            )}
            {isReplyFormVisible && (
              <form onSubmit={handleReply}>
                <textarea
                  value={newReply[comment.id] || "@" + reply.user + " "}
                  onChange={handleReplyContentChange}
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

          </>
        )}
        {isEditing && (
          <div>
            <textarea
              ref={editTextareaRef}
              value={editedContent}
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
        )}
      </div>
    </div>
    </div>
  );
};

export default Reply;

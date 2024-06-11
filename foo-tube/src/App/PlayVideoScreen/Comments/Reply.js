// Reply.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4
import './Reply.css'
const Reply = ({
  key,
  reply,
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
  const navigate = useNavigate();

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
  }, [thisReply]);

  useEffect(() => {
    setUsersLikedReply(thisReply.usersLikes);
    if (usersLikedReply) {
      setTotaluserLikes(usersLikedReply.length);
    }
  }, [usersLikedReply]);

  useEffect(() => {
    if (usersLikedReply && usersLikedReply.length > 0 && usersLikedReply.find(user => user === isSignedIn.username)) {
      setUserLikedReply(true);
    } else {
      setUserLikedReply(false);
    }
  }, [isSignedIn, usersLikedReply]);


  const handleLikeReply = () => {
    if (isSignedIn) {
      const newUsersLikes = [...thisReply.usersLikes, isSignedIn.username];
      const updatedReply = { ...thisReply, usersLikes: newUsersLikes };
      setThisReply(updatedReply);
      handleCommentReplyChange(updatedReply);

    }
    else {
      navigate('/signin');
    }
  };

  const handleUnlikeReply = () => {
    const newUsersLikes = thisReply.usersLikes.filter(user => user !== isSignedIn.username);
    const updatedReply = { ...thisReply, usersLikes: newUsersLikes };
    setThisReply(updatedReply);
    handleCommentReplyChange(updatedReply);
  };

  const handleEditReply = (editContent) => {
    const updatedReply = {
      ...thisReply,
      content: editContent
    };
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
          user: isSignedIn.username,
          content: replyContent,
          usersLikes: []
        }
        updatedComments[commentIndex].replies.push(newReply);
        setCommentList(updatedComments);
        onCommentsChange(updatedComments);
        setNewReply(prevState => ({ ...prevState, [commentId]: '' }));
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
    handleEditReply(editedContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(reply.content);
    setIsEditing(false);
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

  const isLongReply = reply.content.length > 100;

  return (
    <div id="outerreply">
      {author && (
        <div><img  className='profilePic' src={author.image} height="50px" width="50px" ></img></div>
      )}
      <div className="reply" id="innerreply" key={reply.id}>
        {!isEditing && (<>
          <div>@{reply.user}</div>
          <div>
            <p>{isExpanded ? reply.content : reply.content.substring(0, 100)}</p>
            {isLongReply && (
              <button className="btn" onClick={toggleReadMore}>
                {isExpanded ? "Show less" : "...more"}
              </button>
            )}
          </div>
        </>)
        }
        {(isSignedIn.username == reply.user) && (
          <div className="button-container">

            <button className="btn   " onClick={toggleEdit}>
              <i class="bi bi-pencil"></i>
              <span className="icon-text">Edit</span>
            </button>
            <button className="btn  " onClick={() => handleDeleteReply(reply.id)}>
              <i class="bi bi-trash"></i>
              <span className="icon-text">Delete</span>
            </button>

          </div>
        )}
        <div>
          {!isEditing && (
            <>
              <div className='button-container-like-reply'>
                {((isSignedIn && !userLikedReply) || !isSignedIn) && (
                  <button
                    className="btn   like-button"
                    onClick={() => handleLikeReply(reply.id)}
                    aria-label="Like reply"
                  >
                    <i class="bi bi-hand-thumbs-up"></i>
                    <span className="icon-text"> {totalUserLikes}</span>
                  </button>
                )}
                {(isSignedIn && userLikedReply) && (
                  <button
                    className="btn   unlike-button"
                    onClick={() => handleUnlikeReply(reply.id)}
                    aria-label="Unlike reply"
                  >
                    <i class="bi bi-hand-thumbs-up-fill"></i>
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
                        value={newReply[comment.id] || "@" + reply.user + " "}
                        onChange={handleReplyContentChange}
                        className="reply-textarea"
                      ></textarea>
                      <div className="button-container">
                        <button className="btn   cancel-button" onClick={hideReplyForm}>
                          {'Cancel'}
                        </button>
                        <button
                          className="btn   submit-button"
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
                  className="btn   save-button"
                  onClick={handleSaveEdit}
                  aria-label="Save edit"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn   cancel-button"
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

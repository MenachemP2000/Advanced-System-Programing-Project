import React, { useState, useEffect, useRef } from 'react';

const Reply = ({
  reply,
  handleLikeReply,
  handleUnlikeReply,
  handleEditReply,
  handleDeleteReply,
  handleAddReply,
  userLikedReply,
  replyLikes,
  handleReplyChange,
  comment,
  newReply,
  handleReplyContentChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(reply.content);
  const [isReplyFormVisible, setIsReplyFormVisible] = useState(false);
  const editTextareaRef = useRef(null);

  useEffect(() => {
    if (isEditing && editTextareaRef.current) {
      editTextareaRef.current.style.height = 'auto';
      editTextareaRef.current.style.height = editTextareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing, editedContent]);

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
    setIsReplyFormVisible(false);
  };

  const isLongReply = reply.content.length > 100;

  return (
    <div className="reply" key={reply.id}>
      {!isEditing ? (
        <>
          <p>@{reply.user}</p>
          <div>
            <p>{isExpanded ? reply.content : `${reply.content.substring(0, 100)}...`}</p>
            {isLongReply && (
              <button className="btn btn-link" onClick={toggleReadMore}>
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            )}
          </div>
        </>
      ) : (
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
      <div className="button-container">
        {!isEditing && (
          <>
            <button className="btn btn-primary edit-button" onClick={toggleEdit}>Edit</button>
            <button className="btn btn-primary delete-button" onClick={() => handleDeleteReply(reply.id)}>Delete</button>
          </>
        )}
      </div>
      <div>
        {!isEditing && (
          <>
            <button className="btn btn-link" onClick={showReplyForm}>Reply</button>
            {!userLikedReply ? (
              <button
                className="btn btn-primary like-button"
                onClick={() => handleLikeReply(reply.id)}
                aria-label="Like reply"
              >
                {replyLikes} Like
              </button>
            ) : (
              <button
                className="btn btn-primary unlike-button"
                onClick={() => handleUnlikeReply(reply.id)}
                aria-label="Unlike reply"
              >
                Unlike
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
                  <button className="btn btn-primary cancel-button" onClick={hideReplyForm}>Cancel</button>
                  <button className="btn btn-primary submit-button" type="submit" aria-label="Add reply">Reply</button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reply;

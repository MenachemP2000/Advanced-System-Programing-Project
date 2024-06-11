import React, { useState, useRef, useEffect } from 'react';
import './Description.css';

const Description = ({ description, onSave, isSignedIn, username, views }) => {
  const [currentDescription, setCurrentDescription] = useState(description);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Update current description when the description prop changes
    setCurrentDescription(description);
  }, [description]);

  useEffect(() => {
    // Set the initial height of the textarea based on its content
    if (textareaRef.current && isEditing) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
    setIsExpanded(true);
  };

  const handleSaveClick = () => {
    onSave(currentDescription);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setCurrentDescription(description);
    setIsEditing(false);
  };

  const handleTextareaChange = () => {
    setCurrentDescription(textareaRef.current.value);
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="description-container">
      {isEditing ? (
        <div className="description-edit">
          <textarea
            ref={textareaRef}
            id="description-textarea"
            name="description"
            value={currentDescription}
            onChange={handleTextareaChange}
          ></textarea>
          <div className="button-container">
            <button
              className="btn "
              onClick={handleSaveClick}
              aria-label="Save description"
            >
              Save
            </button>
            <button
              className="btn"
              onClick={handleCancelClick}
              aria-label="Cancel editing"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="description-view">
          <div>{views} views</div>
          <p>{isExpanded ? currentDescription : currentDescription.substring(0, 200)}</p>
          {currentDescription.length > 200 && (
            <button className="btn " onClick={toggleReadMore}>
              {isExpanded ? "Show less" : "...more"}
            </button>
          )}
          {(username == isSignedIn.username) && (
            <div className="button-container">
              <button
                className="btn"
                onClick={handleEditClick}
                aria-label="Edit description"
              >

                <i class="bi bi-pencil"></i>
                <span className="icon-text">Edit</span>


              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Description;

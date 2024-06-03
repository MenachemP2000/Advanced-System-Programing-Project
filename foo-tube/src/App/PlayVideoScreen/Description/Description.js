import React, { useState } from 'react';
import './Description.css';

const Description = ({ description, onSave }) => {
  const [currentDescription, setCurrentDescription] = useState(description);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onSave(currentDescription);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setCurrentDescription(description);
    setIsEditing(false);
  };

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const renderDescription = () => {
    if (isExpanded) {
      return (
        <>
          {currentDescription} <button className="btn btn-link" onClick={toggleReadMore}>Read Less</button>
        </>
      );
    } else {
      return (
        <>
          {currentDescription.length > 100 ? currentDescription.substring(0, 100) + '...' : currentDescription}
          {currentDescription.length > 100 && <button className="btn btn-link" onClick={toggleReadMore}>Read More</button>}
        </>
      );
    }
  };

  return (
    <div className="description-container">
      <h2>Description</h2>
      {isEditing ? (
        <div className="description-edit">
          <textarea
            id="description-textarea"
            name="description"
            value={currentDescription}
            onChange={(e) => setCurrentDescription(e.target.value)}
          ></textarea>
          <div className="button-container">
            <button 
              className="btn btn-primary save-button" 
              onClick={handleSaveClick}
              aria-label="Save description"
            >
              Save
            </button>
            <button 
              className="btn btn-primary cancel-button" 
              onClick={handleCancelClick}
              aria-label="Cancel editing"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="description-view">
          <p>{renderDescription()}</p>
          <div className="button-container">
            <button 
              className="btn btn-primary edit-button" 
              onClick={handleEditClick}
              aria-label="Edit description"
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Description;

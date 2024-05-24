// Description.js

import React, { useState } from 'react';
import './Description.css';

const Description = () => {
  const [description, setDescription] = useState("This is a description of the video.");
  const [isEditing, setIsEditing] = useState(false);
  const [tempDescription, setTempDescription] = useState(description);

  const handleEditClick = () => {
    setTempDescription(description);
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setDescription(tempDescription);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return (
    <div className="Description">
      {isEditing ? (
        <div>
          <textarea 
            value={tempDescription}
            onChange={(e) => setTempDescription(e.target.value)}
          ></textarea>
          <div className="buttonContainer">
            <button className='btn btn-primary' onClick={handleSaveClick}>Save</button>
            <button className='btn btn-primary' onClick={handleCancelClick}>Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          <p>{description}</p>
          <div className="buttonContainer"> <button className='btn btn-primary' onClick={handleEditClick}>Edit</button></div>
        </div>
      )}
    </div>
  );
};

export default Description;

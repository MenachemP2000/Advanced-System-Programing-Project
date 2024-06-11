import React from 'react';
import { Link } from 'react-router-dom';
import './DropDown.css';

const DropDown = ({ isOpen, topBarHeight, toggleTheme, isSignedIn, toggleSignendIn }) => {

  const dropDownStyle = {
    bottom: topBarHeight + 'px',
  };
  const handleLogOut = () => {
    toggleSignendIn(false);
  };

  return (
    <div className={`DropDown ${isOpen ? 'open' : ''}`} style={dropDownStyle}>
      <div className="profile">
        {isSignedIn && (
          <>
            <div className='dropDownList'>
              <div className='profile-container'>
                <img src={isSignedIn.image} height="50px" width="50px" ></img>
                <div>
                  <div>{isSignedIn.displayname}</div>
                  <div>@{isSignedIn.username}</div>
                </div>
              </div>

              <p></p>
              <button className="dropDownButton" onClick={handleLogOut}>
                <i class="bi bi-box-arrow-right"></i>
                <span className="icon-text"> Sign out</span>
              </button>

              <button className="theme-toggle dropDownButton" onClick={toggleTheme}>
              <i class="bi bi-moon"></i>
                <span className="icon-text"> Toggle Theme</span>
              </button>


            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DropDown;

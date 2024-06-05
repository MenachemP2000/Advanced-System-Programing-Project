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
        {!isSignedIn && (
          <div className="button-container">
            <Link to="/signin" className="btn btn-primary" >Sign In</Link>
          </div>
        )}
        {isSignedIn && (
          <>
          <div >
            <div className='profile-container'>
              <img src={isSignedIn.image} height="50px" width="50px" ></img>
              <div>
                <div>{isSignedIn.displayname}</div>
                <div>@{isSignedIn.username}</div>
              </div>
            </div>
            
          </div>
          <p></p>
          <button className="btn btn-primary" onClick={handleLogOut}>Log Out</button>
          
          </>
        )}
      </div>
      <div className="button-container">
        <button className="theme-toggle btn btn-primary" onClick={toggleTheme}>Toggle Theme</button>
      </div>
    </div>
  );
}

export default DropDown;

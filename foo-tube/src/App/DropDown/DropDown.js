import React from 'react';
import { Link } from 'react-router-dom';
import './DropDown.css';

const DropDown = ({ isOpen, topBarHeight, toggleTheme ,isSignedIn, toggleScreen}) => {
  
  const dropDownStyle = {
    bottom: topBarHeight + 'px',
  };

  const username =isSignedIn;
  

  return (
    <div className={`DropDown ${isOpen ? 'open' : ''}`} style={dropDownStyle}>
      <div className="profile">
        {!username && (
        <div className="button-container">
          <Link to="/signin" className="btn btn-primary" >Sign In</Link>
        </div>
      )}
      </div>
      <div className="button-container">
        <button className="theme-toggle btn btn-primary" onClick={toggleTheme}>Toggle Theme</button>
      </div>
      <ul>
        <li><a href="#trending">Trending</a></li>
        <li><a href="#subscriptions">Subscriptions</a></li>
        <li><a href="#library">Library</a></li>
      </ul>
    </div>
  );
}

export default DropDown;

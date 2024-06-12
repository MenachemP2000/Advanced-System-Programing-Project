import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DropDown.css';

const DropDown = ({ isOpen, topBarHeight, toggleTheme, isSignedIn, toggleSignendIn, setIsOpen }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const dropDownStyle = {
    bottom: topBarHeight + 'px',
  };

  const handleLogOut = () => {
    toggleSignendIn(false);
    navigate('/');
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`DropDown ${isOpen ? 'open' : ''}`} style={dropDownStyle}>
      <div className="profile">
        {isSignedIn && (
          <>
            <div className='dropDownList'>
              <div className='profile-container'>
                <img src={isSignedIn.image} height="50px" width="50px" alt="Profile" />
                <div>
                  <div>{isSignedIn.displayname}</div>
                  <div>@{isSignedIn.username}</div>
                </div>
              </div>

              <p></p>
              <button className="dropDownButton btn" onClick={handleLogOut}>
                <i className="bi bi-box-arrow-right"></i>
                <span className="icon-text"> Sign out</span>
              </button>

              <button className="theme-toggle btn dropDownButton" onClick={toggleTheme}>
                <i className="bi bi-moon"></i>
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

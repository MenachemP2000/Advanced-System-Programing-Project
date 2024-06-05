import React from 'react';
import './TopBar.css';

const TopBar = ({ toggleMenu, toggleDropDown,isSignedIn }) => {
  const handleSearch = (e) => {
    const query = e.target.value;
    // Logic to handle search query
    console.log('Search query:', query);
  };

  return (
    <div className="TopBar">
      <div className="leftTop">
        <div className="hamburger-menu" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <h1 className="app-title">FooTube&trade;</h1>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          onChange={handleSearch}
        />
      </div>

      <div className="RightTop">
        <div className="hamburger-menu" onClick={toggleDropDown}>

          {isSignedIn && (
            <img src={isSignedIn.image} height="40px" width="40px" ></img>
          )}
          {!isSignedIn && (
            <>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopBar;
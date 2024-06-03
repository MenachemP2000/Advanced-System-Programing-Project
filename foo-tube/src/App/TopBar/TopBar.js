import React from 'react';
import './TopBar.css';

const TopBar = ({ toggleMenu, toggleTheme }) => {
  const handleSearch = (e) => {
    const query = e.target.value;
    // Logic to handle search query
    console.log('Search query:', query);
  };

  return (
    <div className="TopBar">
      <div className ="leftTop">
        <div className="hamburger-menu" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <h1 className="app-title">FooTube&trade;</h1>
      </div>
      <div className ="search">
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          onChange={handleSearch}
        />
      </div>
      <div className='button-container'><button className="theme-toggle btn btn-primary" onClick={toggleTheme}>Toggle Theme</button></div>
    </div>
  );
}

export default TopBar;
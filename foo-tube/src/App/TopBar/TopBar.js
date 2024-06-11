import React, { useEffect, useState } from 'react';
import './TopBar.css';
import { useNavigate, Link } from 'react-router-dom';

const TopBar = ({ toggleMenu, toggleDropDown, isSignedIn, theme }) => {

  const [appTheme, setTheme] = useState(theme);


  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  const handleSearch = (e) => {
    const query = e.target.value;
    // Logic to handle search query
    console.log('Search query:', query);
  };
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/`);
  };

  return (
    <div className="TopBar">
      <div className="leftTop">
        <div className="hamburger-menu" onClick={toggleMenu}>
          <div className={`bar ${appTheme}`}></div>
          <div className={`bar ${appTheme}`}></div>
          <div className={`bar ${appTheme}`}></div>
        </div>
        <h1 className="app-title clickable" onClick={handleClick}>FooTube&trade;</h1>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Search"
          className="search-input"
          onChange={handleSearch}
        />
        <button className='btn'>
        <i class="bi bi-search"></i>
        </button>

      </div>


      {isSignedIn && (
        <div className="RightTop">
          <div className="drop-down">
            <img className="clickable" src={isSignedIn.image} onClick={toggleDropDown} height="40px" width="40px" ></img>
          </div>
        </div>
      )}
      {!isSignedIn && (
        <div className="RightTop">
          <div className="drop-down">
            <Link to="/signin" className="btn" >
            <i class="bi bi-person"></i>
            <span className="icon-text">Sign In</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default TopBar;
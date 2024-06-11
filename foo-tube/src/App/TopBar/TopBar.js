import React, { useEffect, useState } from 'react';
import './TopBar.css';
import { useNavigate, Link } from 'react-router-dom';

const TopBar = ({ toggleMenu, toggleDropDown, isSignedIn, theme }) => {

  const [appTheme, setTheme] = useState(theme);
  const [searchInput, setSearchInput] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };



  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/`);
  };
  const handleSearch = () => {
    const query = searchInput;
    console.log('Search query:', query);
    if (query != "") {
      navigate(`/search/${query}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  const handleExpandSearch = () => {
    setSearchOpen(true);
  };
  const handleCollapseSearch = () => {
    setSearchOpen(false);
  };

  return (
    <>
      <div className='smallTopBar'>
        {searchOpen && (
          <div className="TopBar leftTop bigScreenSearch">
            <button className='btn' onClick={handleCollapseSearch}>
              <i class="bi bi-arrow-return-left"></i>
            </button>
            <input
              type="text"
              placeholder="Search"
              className="search-input"
              value={searchInput}
              onChange={handleInputChange}
              onKeyUp={handleKeyPress}
            />
            <button className='btn' onClick={handleSearch}>
              <i class="bi bi-search"></i>
            </button>
          </div>
        )}
        {!searchOpen && (
          <div className="TopBar">
            <div className="leftTop">
              <div className="hamburger-menu" onClick={toggleMenu}>
                <div className={`bar ${appTheme}`}></div>
                <div className={`bar ${appTheme}`}></div>
                <div className={`bar ${appTheme}`}></div>
              </div>
              <h1 className="app-title clickable" onClick={handleClick}>FooTube&trade;</h1>
            </div>

            {isSignedIn && (
              <div className="RightTopSmall">
                <div className="smallScreenSearch">
                  <button className='btn' onClick={handleExpandSearch}>
                    <i class="bi bi-search"></i>
                  </button>
                </div>
                <div className="drop-down">
                  <img  className="clickable profilePic" src={isSignedIn.image} onClick={toggleDropDown} height="40px" width="40px" ></img>
                </div>
              </div>
            )}
            {!isSignedIn && (
              <div className="RightTopSmall">
                <div className="smallScreenSearch">
                  <button className='btn' onClick={handleExpandSearch}>
                    <i class="bi bi-search"></i>
                  </button>
                </div>
                <div className="drop-down">
                  <Link to="/signin" className="btn SignInBtn" >
                    <i class="bi bi-person"></i>
                    <span className="icon-text">Sign In</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className='bigTopBar'>
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
              value={searchInput}
              onChange={handleInputChange}
              onKeyUp={handleKeyPress}
            />
            <button className='btn' onClick={handleSearch}>
              <i class="bi bi-search"></i>
            </button>
          </div>


          {isSignedIn && (
            <div className="RightTop">
              <div className="drop-down">
                <img className="clickable profilePic" src={isSignedIn.image} onClick={toggleDropDown} height="40px" width="40px" ></img>
              </div>
            </div>
          )}
          {!isSignedIn && (
            <div className="RightTop">
              <div className="drop-down">
                <Link to="/signin" className="btn SignInBtn" >
                  <i class="bi bi-person"></i>
                  <span className="icon-text">Sign In</span>
                </Link>
              </div>
            </div>
          )}
        </div>




      </div>

    </>
  );
}

export default TopBar;
// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import TopBar from './TopBar/TopBar';
import Menu from './Menu/Menu';
import PlayVideoScreen from './PlayVideoScreen/PlayVideoScreen';
import Home from './Home/Home';
import DropDown from './DropDown/DropDown';
import SignIn from './SignIn/SignIn';
import './App.css';
import CreateAccount from './SignIn/CreateAccount';
import Search from './Search/Search';
import UserProfile from './UserProfile/UserProfile';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [screen, setScreen] = useState(false);
  const [isSignedIn, setSignedInStatus] = useState(false);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropDown = () => {
    setDropDownOpen(!dropDownOpen);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const getUserByUserName = async (username) => {
    try {
      const response = await fetch(`http://localhost:4000/api/users/username/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const userFromServer = await response.json();
      setSignedInStatus(userFromServer);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };
  const toggleSignendIn = async (username) => {

    if (username) {
      try {
        await getUserByUserName(username);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    else {
      setSignedInStatus(false);
    }
  };

  const toggleScreen = (screen) => {
    setScreen(screen);
  };

  return (
    <Router>
      <div className={`App ${theme}`}>
        {!(screen == "SignIn" || screen == "CreateAccount") && (
          <>
            <TopBar theme={theme} toggleMenu={toggleMenu} toggleDropDown={toggleDropDown} isSignedIn={isSignedIn} />
            <Menu screen={screen} isOpen={menuOpen} />
            <DropDown setIsOpen={setDropDownOpen} isOpen={dropDownOpen} isSignedIn={isSignedIn} toggleTheme={toggleTheme} toggleSignendIn={toggleSignendIn} />
            {(menuOpen && screen != "Home") && (<div className="Overlay" onClick={toggleMenu}></div>)}
          </>
        )}

        <Routes>
          <Route path="/search/:key" element={<Search toggleScreen={toggleScreen} />} />
          <Route path="/user/:key" element={<UserProfile toggleScreen={toggleScreen} />} />
          <Route path="/signin" element={<SignIn
            toggleScreen={toggleScreen}
            isSignedIn={isSignedIn}
            toggleSignendIn={toggleSignendIn}
          />} />
          <Route path="/createaccount" element={<CreateAccount
            isSignedIn={isSignedIn}
            toggleScreen={toggleScreen}
            toggleSignendIn={toggleSignendIn}
          />} />
          <Route path="/" element={<Home
            toggleScreen={toggleScreen}
            isSignedIn={isSignedIn}
            menuOpen={menuOpen}
          />} />
          <Route path="/video/:id" element={<PlayVideoScreen
            toggleScreen={toggleScreen}
            isSignedIn={isSignedIn}
          />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;


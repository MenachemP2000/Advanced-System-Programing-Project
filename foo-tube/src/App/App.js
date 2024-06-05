// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import TopBar from './TopBar/TopBar';
import Menu from './Menu/Menu';
import PlayVideoScreen from './PlayVideoScreen/PlayVideoScreen';
import Home from './Home/Home';
import DropDown from './DropDown/DropDown';
import SignIn from './SignIn/SignIn';
import './App.css';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [screen, setScreen] = useState(false);
  const [isSignedIn, setSignedInStatus] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const toggleDropDown = () => {
    setDropDownOpen(!dropDownOpen);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleSignendIn = (username) => {
    setSignedInStatus(username);
  };

  const toggleScreen = (screen) => {
    setScreen(screen);
  };

  return (
    <Router>
      <div className={`App ${theme}`}>
      {!(screen =="SignIn") && (
        <>
        <TopBar toggleMenu={toggleMenu} toggleDropDown={toggleDropDown}  />
        <Menu isOpen={menuOpen} />
        <DropDown  isOpen={dropDownOpen} isSignedIn={isSignedIn} toggleTheme={toggleTheme}/>
        {menuOpen && <div className="Overlay" onClick={toggleMenu}></div>}
        </>
      )}
        
        <Routes>
          <Route path="/signin" element={<SignIn toggleScreen={toggleScreen}  toggleSignendIn={toggleSignendIn} />} />
          <Route path="/" element={<Home toggleScreen={toggleScreen} isSignedIn={isSignedIn} />} /> {/* Define a route for the root URL */}
          <Route path="/video/:id" element={<PlayVideoScreen toggleScreen={toggleScreen} isSignedIn={isSignedIn} />} />
          {/* Add other routes here if needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

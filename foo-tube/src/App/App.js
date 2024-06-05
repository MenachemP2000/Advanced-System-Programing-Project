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
import CreateAccount from './SignIn/CreateAccount';
import UserData from './SignIn/users.json'

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [screen, setScreen] = useState(false);
  const [isSignedIn, setSignedInStatus] = useState(false);
  const [users, setUsers] = useState(UserData);

  const addUser = (user) => {
      setUsers((prevUsers) => [...prevUsers, user]);
  };

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
    if (username) {
      setSignedInStatus(users.find(user => user.username === username));
      
    }
    else{
      setSignedInStatus(false);
    }
  };

  const toggleScreen = (screen) => {
    setScreen(screen);
  };

  return (
    <Router>
      <div className={`App ${theme}`}>
      {!(screen =="SignIn" || screen == "CreateAccount") && (
        <>
        <TopBar toggleMenu={toggleMenu} toggleDropDown={toggleDropDown}  isSignedIn={isSignedIn} />
        <Menu isOpen={menuOpen} />
        <DropDown  isOpen={dropDownOpen} isSignedIn={isSignedIn} toggleTheme={toggleTheme} toggleSignendIn={toggleSignendIn}/>
        {menuOpen && <div className="Overlay" onClick={toggleMenu}></div>}
        </>
      )}
        
        <Routes>
          <Route path="/signin" element={<SignIn users={users} setUsers={setUsers} toggleScreen={toggleScreen} isSignedIn={isSignedIn}  toggleSignendIn={toggleSignendIn} />} />
          <Route path="/createaccount" element={<CreateAccount setSignedInStatus={setSignedInStatus} users={users} addUser={addUser} isSignedIn={isSignedIn} toggleScreen={toggleScreen}  toggleSignendIn={toggleSignendIn} />} />
          <Route path="/" element={<Home toggleScreen={toggleScreen} isSignedIn={isSignedIn} />} /> {/* Define a route for the root URL */}
          <Route path="/video/:id" element={<PlayVideoScreen users={users} toggleScreen={toggleScreen} isSignedIn={isSignedIn} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

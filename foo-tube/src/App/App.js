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

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [screen, setScreen] = useState(false);
  const [isSignedIn, setSignedInStatus] = useState(false);
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getUsers();
    getVideos();
  }, []);

  const getUsers = async () => {
    try {
      // Fetch users data
      const usersResponse = await fetch('http://localhost:4000/api/users');
      const usersData = await usersResponse.json();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  const getVideos = async () => {
    try {
      // Fetch videos data
      const videosResponse = await fetch('http://localhost:4000/api/videos');
      const videosData = await videosResponse.json();
      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };



  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const addUser = async (newUser) => {
    try {
      const response = await fetch('http://localhost:4000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        throw new Error('Failed to add new user');
      }
      const newUserFromServer = await response.json();
      setUsers(prevUsers => [...prevUsers, newUserFromServer]);
    } catch (error) {
      console.error('Error adding new user:', error);
    }
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
          <Route path="/search/:key" element={<Search users={users} toggleScreen={toggleScreen} videos={videos} />} />
          <Route path="/signin" element={<SignIn users={users} setUsers={setUsers} toggleScreen={toggleScreen} isSignedIn={isSignedIn} toggleSignendIn={toggleSignendIn} />} />
          <Route path="/createaccount" element={<CreateAccount setSignedInStatus={setSignedInStatus} users={users} addUser={addUser} isSignedIn={isSignedIn} toggleScreen={toggleScreen} toggleSignendIn={toggleSignendIn} />} />
          <Route path="/" element={<Home toggleScreen={toggleScreen}
            videos={videos}
            isSignedIn={isSignedIn}
            menuOpen={menuOpen}
            users={users}
          />} />
          <Route path="/video/:id" element={<PlayVideoScreen
            appVideos={videos}
            users={users}
            toggleScreen={toggleScreen}
            isSignedIn={isSignedIn}
            setAppVideos={setVideos}
          />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;


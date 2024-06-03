// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import TopBar from './TopBar/TopBar';
import Menu from './Menu/Menu';
import PlayVideoScreen from './PlayVideoScreen/PlayVideoScreen';
import './App.css';
import Home from './Home/Home';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      <div className={`App ${theme}`}>
        <TopBar toggleMenu={toggleMenu} toggleTheme={toggleTheme} />
        <Menu isOpen={menuOpen} />
        {menuOpen && <div className="Overlay" onClick={toggleMenu}></div>}
        
        <Routes>
          <Route path="/" element={<Home />} /> {/* Define a route for the root URL */}
          <Route path="/video/:id" element={<PlayVideoScreen />} />
          {/* Add other routes here if needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

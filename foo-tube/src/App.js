import React, { useState } from 'react';
import TopBar from './TopBar';
import Menu from './Menu';
import './App.css';
import PlayVideoScreen from './PlayVideoScreen';

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
    <div className={`App ${theme}`}>
      <TopBar toggleMenu={toggleMenu} toggleTheme={toggleTheme} />
      <Menu isOpen={menuOpen} />
      {menuOpen && <div className="Overlay" onClick={toggleMenu}></div>}
      <PlayVideoScreen/>
    </div>
  );
}

export default App;

import React from 'react';
import './Menu.css';

const Menu = ({ isOpen, topBarHeight }) => {
  const menuStyle = {
    top: topBarHeight + 'px',
  };

  return (
    <div className={`Menu ${isOpen ? 'open' : ''}`} style={menuStyle}>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#trending">Trending</a></li>
        <li><a href="#subscriptions">Subscriptions</a></li>
        <li><a href="#library">Library</a></li>
      </ul>
    </div>
  );
}

export default Menu;

import React from 'react';
import './Menu.css';
import { Link } from 'react-router-dom';


const Menu = ({ isOpen, topBarHeight }) => {
  const menuStyle = {
    top: topBarHeight + 'px',
  };

  return (
    <div className={`Menu ${isOpen ? 'open' : ''}`} style={menuStyle}>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><a href="#trending">Trending</a></li>
        <li><a href="#subscriptions">Subscriptions</a></li>
        <li><a href="#library">Library</a></li>
      </ul>
    </div>
  );
}

export default Menu;

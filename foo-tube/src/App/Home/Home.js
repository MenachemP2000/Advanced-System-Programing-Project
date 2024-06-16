import { React, useEffect, useState } from 'react';
import { Form, Link } from 'react-router-dom';
import RecommendedVideos from './RecommendedVideos/RecommendedVideos';

import './Home.css';


const Home = ({toggleScreen, videos,menuOpen, isSignedIn, users  }) => {
  const [menuOpenStatus, setMenuOpenStatus] = useState(false);


  useEffect(() => {
    toggleScreen("Home");
  }, []);

  useEffect(() => {
    setMenuOpenStatus(menuOpen);
    console.log("changed");
  }, [menuOpen]);

  return (
    
    <div>
      <div className={`${menuOpen ? 'opend' : 'closed'}`}>
          <RecommendedVideos videos={videos}  menuOpen={menuOpen} users={users} />
      </div>
    </div>
  );
};

export default Home;

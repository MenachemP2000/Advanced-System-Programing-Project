import { React, useEffect, useState } from 'react';
import RecommendedVideos from './RecommendedVideos/RecommendedVideos';

import './Home.css';


const Home = ({ toggleScreen, menuOpen }) => {
  const [menuOpenStatus, setMenuOpenStatus] = useState(false);
  const [recommendedVideos, setRecommendedVideos] = useState([]);


  useEffect(() => {
    toggleScreen("Home");
    getVideos();
  }, []);

  useEffect(() => {
    setMenuOpenStatus(menuOpen);
    console.log("changed");
  }, [menuOpen]);

  const getVideos = async () => {
    try {
      // Fetch videos data
      const videosResponse = await fetch('http://localhost:4000/api/videos');
      const videosData = await videosResponse.json();
      setRecommendedVideos(videosData);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  return (
    <div>
      <div className={`${menuOpen ? 'opend' : 'closed'}`}>
        <RecommendedVideos videos={recommendedVideos} menuOpen={menuOpen} />
      </div>
    </div>
  );
};

export default Home;

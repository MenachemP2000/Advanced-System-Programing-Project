import React, { useState, useEffect } from 'react';
import './RecommendedVideos.css';
import RecommendedBox from './RecommendedBox/RecomendedBox';


const RecommendedVideos = ({ videos, menuOpen}) => {
  const [relatedVideos, setRelatedVideos] = useState([]);
  useEffect(() => {
    setRelatedVideos(shuffleArray(videos));
  }, [videos]);

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };
  
  return (
    <div className={`RecommendedVideos ${menuOpen ? 'RecommendedVideosOpen' : 'RecommendedVideosClose'}`}>
      <ul>
        {relatedVideos.map(video => (
          <RecommendedBox
            video={video}
          />
        ))}
      </ul>
    </div>
  );
};

export default RecommendedVideos;

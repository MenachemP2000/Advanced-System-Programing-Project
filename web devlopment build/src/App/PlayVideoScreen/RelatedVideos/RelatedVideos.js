import React, { useState, useEffect } from 'react';
import './RelatedVideos.css';
import RelatedBox from './RelatedBox/RelatedBox'
import config from '../../config';



const RelatedVideos = ({ videos, id }) => {
  const [relatedVideos, setRelatedVideos] = useState([]);


  useEffect(() => {
    const fetchVideos = async () => {
      await getVideos();
    };
    fetchVideos();
  }, [id]);


  const getVideos = async () => {
    try {
      // Fetch videos data
      const videosResponse = await fetch(`${config.apiBaseUrl}/api/videos`);
      const videosData = await videosResponse.json();
      setRelatedVideos( shuffleArray(videosData.filter(v => v._id !== id)));

    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const shuffleArray =  (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  return (
    <div className="RelatedVideos">
      <ul>
        {relatedVideos.map(video => (
          <RelatedBox
            video={video}
          />

        ))}
      </ul>
    </div>
  );
};

export default RelatedVideos;

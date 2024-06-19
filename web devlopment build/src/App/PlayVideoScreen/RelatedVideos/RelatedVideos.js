import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RelatedVideos.css';
import RelatedBox from './RelatedBox/RelatedBox'


const RelatedVideos = ({ videos, id }) => {
  const [relatedVideos, setRelatedVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setRelatedVideos(shuffleArray(videos.filter(v => v._id !== id)));
  }, [id]);

  const handleVideoClick = (id) => {
    navigate(`/video/${id}`);
  };

  const shuffleArray = (array) => {
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

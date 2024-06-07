import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RelatedVideos.css';


const RelatedVideos = ({ videos}) => {
  const [relatedVideos, setRelatedVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setRelatedVideos(videos);
  }, []);

  const handleVideoClick = (id) => {
    navigate(`/video/${id}`);
  };

  return (
    <div className="RelatedVideos">
      <ul>
        {relatedVideos.map(video => (
          <li key={video.id} onClick={() => handleVideoClick(video.id)}>
              <img src={video.thumbnail} alt={video.title} />
              <div className="video-info">
                <h3>{video.title}</h3>
                <p>{video.username}</p>
                <p>{video.views} views</p>
              </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedVideos;

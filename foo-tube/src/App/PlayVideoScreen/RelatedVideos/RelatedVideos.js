import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RelatedVideos.css';


const RelatedVideos = ({videoData}) => {
  const [relatedVideos, setRelatedVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setRelatedVideos(videoData.videos);
  }, []);

  const handleVideoClick = (id) => {
    navigate(`/video/${id}`);
  };

  return (
    <div className="RelatedVideos">
      <h2>Related Videos</h2>
      <ul>
        {relatedVideos.map(video => (
          <li key={video.id} onClick={() => handleVideoClick(video.id)}>
            <img src={video.thumbnail} alt={video.title} />
            <div className="video-info">
              <h3>{video.title}</h3>
              <p>By: {video.username}</p>
              <p>Likes: {video.likeCount}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedVideos;

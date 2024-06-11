import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecommendedVideos.css';


const RecommendedVideos = ({ videos, menuOpen, users }) => {
  const [relatedVideos, setRelatedVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setRelatedVideos(videos);
  }, []);

  const handleVideoClick = (id) => {
    navigate(`/video/${id}`);
  };

  return (
    <div className={`RecommendedVideos ${menuOpen ? 'RecommendedVideosOpen' : 'RecommendedVideosClose'}`}>
      <ul>
        {relatedVideos.map(video => (
          <li className='clickable' key={video.id} onClick={() => handleVideoClick(video.id)}>
            <img className='thumbNail' src={video.thumbnail} alt={video.title} />
            <div className='videoDetails'>
              <img src={users.find(author => author.username === video.username).image} height="35px" width="35px" ></img>
              <div className="video-info">
                <h3>{video.title}</h3>
                <p>{video.username}</p>
                <p>{video.views} views</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendedVideos;

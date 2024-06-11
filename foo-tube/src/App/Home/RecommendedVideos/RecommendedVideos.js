import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecommendedVideos.css';


const RecommendedVideos = ({ videos, menuOpen, users }) => {
  const [relatedVideos, setRelatedVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setRelatedVideos(shuffleArray(videos));
  }, [videos]);

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

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserProfile.css';
import UserBox from './UserBox/UserBox'
import config from '../config';



const Search = ({ toggleScreen }) => {
  const [searchVideos, setSearchVideos] = useState([]);
  const navigate = useNavigate();
  const { key } = useParams();

  useEffect(() => {
    toggleScreen("UserProfile");
    fetchVideos();
  }, [key]);

  const fetchVideos = async () => {
    await getVideosByKeyAndFilter("title", "username", key);
  };

  const getVideosByKeyAndFilter = async (filter1, filter2, key) => {
    try {
      // Fetch videos data
      const videosResponse = await fetch(`${config.apiBaseUrl}/api/videos?${filter1}=${key}&${filter2}=${key}`);
      const videosData = await videosResponse.json();
      setSearchVideos(shuffleArray([...videosData]));
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

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

  while (!(searchVideos)) {
    fetchVideos();
    return <div>Loading...</div>;
  }

  return (
    <div className="userVideos">
      <ul>
        {searchVideos.length == 0 && (
          <div>
            <p></p>
            <h3>No Results Found</h3>
          </div>
        )}
        {searchVideos.map(video => (
          <UserBox
            video={video}
          />
        ))}
      </ul>
    </div>
  );
};

export default Search;
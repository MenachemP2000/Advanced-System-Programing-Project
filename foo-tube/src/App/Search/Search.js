import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Search.css';


const Search = ({ toggleScreen, videos, users }) => {
  const [searchVideos, setSearchVideos] = useState([]);
  const navigate = useNavigate();
  const { key } = useParams();

  useEffect(() => {
    toggleScreen("Search");
    const videosWithUsername = videos.filter(video => video.username.toLowerCase() === key.toLowerCase());
    const videosWithTitleWord = videos.filter(video => video.title.toLowerCase().includes(key.toLowerCase()));
    const combinedVideos = [...videosWithUsername, ...videosWithTitleWord];
    setSearchVideos(shuffleArray(combinedVideos));

  }, [videos, key]);


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
    <div className="searchVideos">
      <ul>
        {searchVideos.length == 0 && (
          <div>
            <p></p>
            <h3>No Results Found</h3>


          </div>
        )}
        {searchVideos.map(video => (
          <li className='clickable' key={video._id} onClick={() => handleVideoClick(video._id)}>
            <img className='thumbNail' src={video.thumbnail} alt={video.title} />
            <div className="video-info">
              <h3>{video.title}</h3>
              <p>{video.views} views</p>

              <div className='profileSearchVideos'>
                <img className='profliePic' src={users.find(author => author.username === video.username).image} height="24px" width="24px" ></img>
                <p>{video.username}</p>
              </div>

              <p>{video.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
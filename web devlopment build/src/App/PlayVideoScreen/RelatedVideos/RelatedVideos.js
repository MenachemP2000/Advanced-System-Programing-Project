import React, { useState, useEffect } from 'react';
import './RelatedVideos.css';
import RelatedBox from './RelatedBox/RelatedBox'
import config from '../../config';



const RelatedVideos = ({ id }) => {
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
      const videosResponse = await fetch(`${config.apiBaseUrl}/api/videos/${id}/related`);
      const videosData = await videosResponse.json();
      setRelatedVideos(videosData);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
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

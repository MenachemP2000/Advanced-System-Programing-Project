import React, { useState, useEffect, useRef } from 'react';
import './RelatedVideos.css';
import RelatedBox from './RelatedBox/RelatedBox'
import config from '../../config';



const RelatedVideos = ({ id, itsBig }) => {
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    setLoading(false);
    setHasMore(true);
    setRelatedVideos([]);
    setPage(1);
    const fetchVideos = async () => {
      await getVideos(1);
    };
    fetchVideos();
  }, [id]);

  const getVideos = async (pageToLoad) => {
    setLoading(true);
    let limit = 10;
    try {
      const apiUrl = `${config.apiBaseUrl}/api/videos/${id}/related?page=${pageToLoad}&limit=${limit}`;
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const videosResponse = await fetch(apiUrl, requestOptions);
      const data = await videosResponse.json();

      setRelatedVideos(prevVideos => [...prevVideos, ...data.videos]);

      if (data.videos.length < limit) {
        setHasMore(false);
      }
      setPage(pageToLoad + 1);
      console.log(page);

    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120 && !loading && hasMore && itsBig) {
      getVideos(page);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, relatedVideos, id]);


  return (
    <div className="RelatedVideos">
      <ul>
        {relatedVideos.map((video, index) => (
          <RelatedBox
            key={index}
            video={video}
          />
        ))}
        {(!hasMore && false) && (
          <li>
            <img className="thumbNail" />
            <div className="video-info">
              <h3>
                No more Videos ...
              </h3>
              <p ></p>
              <p></p>
            </div>
          </li>
        )}
        {loading && (
          <li>
            <img className="thumbNail" />
            <div className="video-info">
              <h3>
              </h3>
              <p ></p>
              <p></p>
            </div>
          </li>
        )}

        {((!loading) && (!itsBig) && (hasMore)) && (
          <li className='clickable' onClick={() => getVideos(page)} >
            <button className="show-more btn">
                show more
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default RelatedVideos;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PlayVideoScreen.css';
import RelatedVideos from './RelatedVideos/RelatedVideos';
import Comments from './Comments/Comments';
import Description from './Description/Description';
import videoData from './MetaData/videos.json'; // Corrected the import path

const PlayVideoScreen = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchVideo = () => {
      const video = videoData.videos.find(v => v.id === id);
      if (video) {
        setVideo(video);
        setLikeCount(video.likeCount || 0);  // Assuming your video data has a likeCount field
      }
    };
    fetchVideo();
  }, [id]);

  const handleLike = () => {
    if (liked) {
      setLikeCount(prevCount => prevCount - 1);
      setLiked(false);
    } else {
      setLikeCount(prevCount => prevCount + 1);
      setLiked(true);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Check out this video: ${video.title}`,
          text: video.description,
          url: `https://yourvideo.url/video/${id}`
        });
        console.log('Successfully shared.');
      } else {
        console.log('Web Share API not supported.');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSaveDescription = (newDescription) => {
    setVideo(prevVideo => ({ ...prevVideo, description: newDescription }));
    // Save the new description to the server or local storage here if needed
  };

  const handleCommentsChange = (newComments) => {
    setVideo(prevVideo => ({ ...prevVideo, comments: newComments }));
    // Save the new comments to the server or local storage here if needed
  };

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div className='PlayVideoScreen'>
      <div className="videoContainer">
        <video className="VideoPlayer" controls>
          <source src={video.source} type="video/mp4" />
        </video>
        <div className="videoTitle">{video.title}</div>
        <div className="buttonContainer">
          <button type="button" className="btn btn-primary" onClick={handleLike}>
            {liked ? 'Unlike' : 'Like'} {likeCount}
          </button>
          <button type="button" className="btn btn-primary" onClick={handleShare}>
            Share
          </button>
        </div>
        <Description description={video.description} onSave={handleSaveDescription} />
        <Comments comments={video.comments} onCommentsChange={handleCommentsChange} />
      </div>
      <div className="sidebar">
        <RelatedVideos />
      </div>
    </div>
  );
};

export default PlayVideoScreen;

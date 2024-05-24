
import React, { useState } from 'react';
import './PlayVideoScreen.css';
import RelatedVideos from './RelatedVideos';
import Comments from './Comments';
import Description from './Description';

const PlayVideoScreen = () => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleLike = () => {
    if (liked) {
      // If already liked, remove the like
      setLikeCount(prevCount => prevCount - 1);
      setLiked(false);
    } else {
      // If not liked, add the like
      setLikeCount(prevCount => prevCount + 1);
      setLiked(true);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this video!',
          text: 'Watch this amazing video:',
          url: 'https://media.geeksforgeeks.org/wp-content/uploads/20190616234019/Canvas.move_.mp4'
        });
        console.log('Successfully shared.');
      } else {
        console.log('Web Share API not supported.');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className='PlayVideoScreen'>
      <div className="videoContainer">
        <video className="VideoPlayer" controls>
          <source src="https://media.geeksforgeeks.org/wp-content/uploads/20190616234019/Canvas.move_.mp4" type="video/mp4" />
        </video>
        <div className="buttonContainer">
          <button type="button" class="btn btn-primary" onClick={handleLike}>{liked ? 'Unlike' : 'Like'}  {likeCount}</button>
          <span className="likeCounter"> </span>
          <button type="button" class="btn btn-primary" onClick={handleShare}>Share</button>
        </div>
        <Description />
        <Comments />
      </div>  
      <div className="sidebar">
        <RelatedVideos />
      </div>
    </div>
  );
};

export default PlayVideoScreen;

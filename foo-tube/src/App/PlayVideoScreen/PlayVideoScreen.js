import React, { useState, useEffect } from 'react';
import { useParams , useNavigate} from 'react-router-dom';
import './PlayVideoScreen.css';
import RelatedVideos from './RelatedVideos/RelatedVideos';
import Comments from './Comments/Comments';
import Description from './Description/Description';

const PlayVideoScreen = ({ toggleScreen, onVideoChange, isSignedIn, users, likeVideo, unlikeVideo, videoData, videos, likeComment, unlikeComment }) => {
  const { id } = useParams();
  const [video, setVideo] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [author, setAuthor] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    toggleScreen("PlayVideoScreen");
    const fetchVideo = () => {
      const video = videos.find(v => v.id === id);
      if (video) {
        setVideo(video);
        setLikeCount(video.likeCount || 0);
        setAuthor(users.find(author => author.username === video.username));
        setRelatedVideos(videos.filter(v => v.id !== id)); 
      }
    };
    fetchVideo();
  }, [id, toggleScreen, users]);

  useEffect(() => {
    setLikeCount(video.likeCount);
  }, [video, video.usersLikes]);

  useEffect(() => {
    if (video.usersLikes && video.usersLikes.length > 0 && video.usersLikes.find(user => user === isSignedIn)) {
      setLiked(true);
    } else {

      setLiked(false);
    }
  }, [isSignedIn, video.usersLikes]);


  const handleLike = () => {
    if (!isSignedIn) {
      navigate('/signin');
    }
    else{
      likeVideo(video.id);
    }
  };
  const handleUnlike = () => {
    unlikeVideo(video.id);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Check out this video: ${video.title}`,
          text: video.description,
          url: `/video/${id}`
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
    console.log(newDescription);
    const updatedVideo = { ...video, description: newDescription };
    setVideo(updatedVideo);
    console.log(updatedVideo);
    onVideoChange(updatedVideo);
};

  const handleCommentsChange = (newComments) => {
    setVideo(prevVideo => {
      const updatedVideo = { ...prevVideo, comments: newComments };
      onVideoChange(updatedVideo);
      return updatedVideo;
    });
  };


  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div className='PlayVideoScreen'>
      <div className="videoContainer">
        <video src={video.source} type="video/mp4" className="VideoPlayer" controls />
        <div className="videoTitle">{video.title}</div>
        <div className="videoProfile">
          <div id="profilepicandname">
            <img  className='profilePic' src={author.image} height="50px" width="50px" ></img>
            <div id="profilename">
              {author.username}
            </div>

          </div>
          <div className="buttonContainer">
            {isSignedIn && liked && (
              <div>

                <button type="button" className="btn" onClick={handleUnlike}>
                  <i class="bi bi-hand-thumbs-down"></i>
                  <span className="icon-text"> {likeCount}</span>
                </button>
              </div>
            )}

            {((isSignedIn && !liked) || !isSignedIn )&& (
              <div>
                <button type="button" className="btn" onClick={handleLike}>
                  <i class="bi bi-hand-thumbs-up"></i>
                  <span className="icon-text"> {likeCount}</span>
                </button>
              </div>
            )}
            <button type="button" className="btn  " onClick={handleShare}>
              <i class="bi bi-share"></i>
              <span className="icon-text"> Share</span>
            </button>
          </div>

        </div>
        <Description views={video.views} description={video.description} username={video.username} isSignedIn={isSignedIn} onSave={handleSaveDescription} />

        <div className="sidebarSmall">
          <RelatedVideos videos={relatedVideos} videoData={videoData} />
        </div>
        <Comments
          videoId={video.id}
          comments={video.comments}
          unlikeComment={unlikeComment}
          likeComment={likeComment}
          users={users}
          isSignedIn={isSignedIn}
          onCommentsChange={handleCommentsChange}
          videos={videos}
        />
      </div>
      <div className="sidebarBig">
        <RelatedVideos videoData={videoData} videos={relatedVideos} />
      </div>
    </div>
  );
};

export default PlayVideoScreen;

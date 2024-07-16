import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PlayVideoScreen.css';
import RelatedVideos from './RelatedVideos/RelatedVideos';
import Comments from './Comments/Comments';
import Description from './Description/Description';

const PlayVideoScreen = ({ onVideoDelete, toggleScreen, onVideoChange, isSignedIn, users, likeVideo, unlikeVideo, videoData, videos, likeComment, unlikeComment }) => {
  const { id } = useParams();
  const [video, setVideo] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [author, setAuthor] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const [newTitle, setNewTitle] = useState(false);


  useEffect(() => {
    toggleScreen("PlayVideoScreen");
    const fetchVideo = () => {
      const video = videos.find(v => v.id === id);
      if (video) {
        setVideo(video);
        setLikeCount(video.likeCount || 0);
        setAuthor(users.find(author => author.username === video.username));
        setRelatedVideos(videos);
        setCurrentTitle(video.title);
        setIsEditing(false);
        setNewTitle(video.title);
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
    else {
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
          title: `Check out this video: ${currentTitle}`,
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
    const updatedVideo = { ...video, description: newDescription };
    setVideo(updatedVideo);
    onVideoChange(updatedVideo);
  };

  const handleCommentsChange = (newComments) => {
    setVideo(prevVideo => {
      const updatedVideo = { ...prevVideo, comments: newComments };
      onVideoChange(updatedVideo);
      return updatedVideo;
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (newTitle === "") {
      handleCancelClick()

    }
    else {
      setCurrentTitle(newTitle);
      const updatedVideo = { ...video, title: newTitle };
      setVideo(updatedVideo);
      onVideoChange(updatedVideo);
      setIsEditing(false);
    }
  };

  const handleCancelClick = () => {
    setNewTitle(currentTitle);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setIsEditing(false);
    onVideoDelete(video);
    navigate('/');
  };


  const handleTextareaChange = () => {
    setNewTitle(textareaRef.current.value);
  };

  if (!video) {
    return <div>Loading...</div>;
  }

  const videoSource = video.thumbnailFile ? URL.createObjectURL(video.videoFile) : video.source;

  return (
    <div className='PlayVideoScreen'>
      <div className="videoContainer">
        <video src={videoSource} type="video/mp4" className="VideoPlayer" controls />
        {!isEditing && (
          <>
            <div className="videoTitle">{currentTitle}</div>

            <div className="videoProfile">
              <div id="profilepicandname">
                <img className='profilePic' src={author.image} height="50px" width="50px" ></img>
                <div id="profilename">
                  {author.username}
                </div>

              </div>
              <div className="buttonContainer">
                {isSignedIn && liked && (
                  <div>

                    <button type="button" className="btn" onClick={handleUnlike}>
                      <i class="bi bi-hand-thumbs-up-fill"></i>
                      <span className="icon-text"> {likeCount}</span>
                    </button>
                  </div>
                )}

                {((isSignedIn && !liked) || !isSignedIn) && (
                  <div>
                    <button type="button" className="btn" onClick={handleLike}>
                      <i class="bi bi-hand-thumbs-up"></i>
                      <span className="icon-text"> {likeCount}</span>
                    </button>
                  </div>
                )}
                <button type="button" className="btn" onClick={handleShare}>
                  <i class="bi bi-share"></i>
                  <span id="shareVideo" className="icon-text"> Share</span>
                </button>

                {((isSignedIn === author)) && (
                  <>
                    <button type="button" className="btn" onClick={handleEditClick}>
                      <i class="bi bi-pencil"></i>
                      <span id="editVideo" className="icon-text"> edit</span>
                    </button>

                    <button type="button" className="btn" onClick={handleDeleteClick}>
                      <i class="bi bi-trash"></i>
                      <span id="deleteVideo" className="icon-text"> Delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
        {isEditing && (
          <>
            <textarea
              ref={textareaRef}
              id="title-textarea"
              name="title"
              value={newTitle}
              onChange={handleTextareaChange}
            ></textarea>

            <div className="videoProfile">
              <div id="profilepicandname">
                <img className='profilePic' src={author.image} height="50px" width="50px" ></img>
                <div id="profilename">
                  {author.username}
                </div>

              </div>
              <div className="buttonContainer">

                <button type="button" className="btn" onClick={handleSaveClick}>
                  Save
                </button>

                <button type="button" className="btn" onClick={handleCancelClick}>
                  Cancel
                </button>

              </div>
            </div>
          </>
        )}





        <Description views={video.views} description={video.description} username={video.username} isSignedIn={isSignedIn} onSave={handleSaveDescription} />

        <div className="sidebarSmall">
          <RelatedVideos users={users} id={id} videos={relatedVideos} videoData={videoData} />
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
        <RelatedVideos users={users} id={id} videoData={videoData} videos={relatedVideos} />
      </div>
    </div>
  );
};

export default PlayVideoScreen;

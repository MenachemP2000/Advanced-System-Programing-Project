import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PlayVideoScreen.css';
import RelatedVideos from './RelatedVideos/RelatedVideos';
import Comments from './Comments/Comments';
import Description from './Description/Description';
import config from '../config';

const PlayVideoScreen = ({ toggleScreen, isSignedIn }) => {
  const { id } = useParams();
  const [video, setVideo] = useState(false);
  const [liked, setLiked] = useState(false);
  const [author, setAuthor] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const [newTitle, setNewTitle] = useState(false);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    toggleScreen("PlayVideoScreen");
    const fetchVideo = async () => {
      getVideos();
      await getVideo(id);
    };
    fetchVideo();
  }, [id, toggleScreen]);

  useEffect(() => {
    if (video) {
      getAuthorByUserName(video.username);
      setRelatedVideos(videos);
      setCurrentTitle(video.title);
      setIsEditing(false);
      setNewTitle(video.title);
    }
  }, [video]);

  useEffect(() => {
    addVideoView(id);
  }, [id]);


  useEffect(() => {
    if (isSignedIn && video && video.usersLikes.find(user => user === isSignedIn._id)) {
      setLiked(true);
    }
    else {
      setLiked(false)
    }
  }, [video, video.usersLikes]);


  const getVideos = async () => {
    try {
      // Fetch videos data
      const videosResponse = await fetch(`${config.apiBaseUrl}/api/videos`);
      const videosData = await videosResponse.json();
      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };


  const getVideo = async (videoId) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/videos/${videoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }
      const videoFromServer = await response.json();
      setVideo(videoFromServer);
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };
  const getVideoWithoutChangingState = async (videoId) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/videos/${videoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }
      const videoFromServer = await response.json();
      return videoFromServer;
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };
  const getAuthorByUserName = async (username) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/users/username/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const userFromServer = await response.json();
      setAuthor(userFromServer);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };
  const addVideo = async (newVideo) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVideo),
      });
      if (!response.ok) {
        throw new Error('Failed to add new video');
      }
      const newVideoFromServer = await response.json();
      setVideos(prevVideos => [...prevVideos, newVideoFromServer]);
    } catch (error) {
      console.error('Error adding new video:', error);
    }
  };
  const updateVideo = async (updatedVideo) => {
    try {
      const updatedVideoFromServer = await sendUpdateRequest(updatedVideo, 'PUT');
      setVideos(prevVideos =>
        prevVideos.map(video =>
          video._id === updatedVideoFromServer._id ? updatedVideoFromServer : video
        )
      );
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };
  const partialUpdateVideo = async (updatedVideo) => {
    try {
      const originalVideo = await getVideoWithoutChangingState(updatedVideo._id);
      if (!originalVideo) {
        throw new Error('Video not found in the local state');
      }
      // Prepare an object to store updated fields
      const updatedFields = Object.keys(updatedVideo).reduce((fields, key) => {
        if (updatedVideo[key] !== originalVideo[key]) {
          fields[key] = updatedVideo[key];
        }
        return fields;
      }, {});
      updatedFields._id = originalVideo._id;

      // Update the video with the updated fields
      const updatedVideoFromServer = await sendUpdateRequest(updatedFields, 'PATCH');
      setVideo(updatedVideoFromServer);

      // Update local state with the updated video from server
      setVideos(prevVideos =>
        prevVideos.map(video =>
          video._id === updatedVideoFromServer._id ? updatedVideoFromServer : video
        )
      );
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };
  const sendUpdateRequest = async (updatedVideo, method) => {
    const url = `${config.apiBaseUrl}/api/videos/${updatedVideo._id}`;
    let bodyData = {};

    if (method === 'PATCH') {
      // Construct bodyData with only the updated fields
      const fieldsToUpdate = ['title', 'description', 'source', 'thumbnail', 'tags', 'upload_date', 'duration', 'username', 'likeCount', 'views', 'usersLikes', 'comments'];
      bodyData = {};
      fieldsToUpdate.forEach(field => {
        if (updatedVideo.hasOwnProperty(field)) {
          bodyData[field] = updatedVideo[field];
        }
      });
    } else if (method === 'PUT') {
      // For PUT, send the entire updatedVideo object
      bodyData = updatedVideo;
    }

    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Failed to update video');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating video:', error);
      throw error; // Rethrow the error for handling in the calling function
    }
  };
  const deleteVideo = async (video) => {
    const videoId = video._id;
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete video');
      }

      setVideos(prevVideos => prevVideos.filter(video => video._id !== videoId));
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };
  const addVideoView = async (videoId) => {
    try {
      const videoToUpdate = await getVideoWithoutChangingState(videoId);
      if (!videoToUpdate) {
        throw new Error('Video not found');
      }
      const updatedVideo = {
        _id: id,
        views: videoToUpdate.views + 1
      };
      await partialUpdateVideo(updatedVideo);
    } catch (error) {
      console.error('Error viewing video:', error);
    }
  };

  const likeVideo = async () => {
    try {
      const updatedVideo = {
        _id: id,
        likeCount: video.likeCount + 1,
        usersLikes: [...video.usersLikes, isSignedIn]
      };
      await partialUpdateVideo(updatedVideo);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };
  const unlikeVideo = async () => {
    try {
      const updatedVideo = {
        _id: id,
        likeCount: Math.max(video.likeCount - 1, 0),
        usersLikes: video.usersLikes.filter(user => user !== isSignedIn._id)
      };
      await partialUpdateVideo(updatedVideo);
    } catch (error) {
      console.error('Error unliking video:', error);
    }
  };
  const handleSaveDescription = async (newDescription) => {
    try {
      const updatedVideo = {
        _id: id,
        description: newDescription
      };
      await partialUpdateVideo(updatedVideo);
    } catch (error) {
      console.error('Error saving Description:', error);
    }
  };

  const handleLike = () => {
    if (!isSignedIn) {
      navigate('/signin');
    }
    else {
      likeVideo(video._id);
    }
  };
  const handleUnlike = () => {
    unlikeVideo(video._id);
  };
  const handleSaveClick = async () => {
    if (newTitle === "") {
      handleCancelClick()
    }
    else {
      setCurrentTitle(newTitle);
      setIsEditing(false);

      try {
        const updatedVideo = {
          _id: id,
          title: newTitle
        };
        await partialUpdateVideo(updatedVideo);
      } catch (error) {
        console.error('Error saving Title:', error);
      }
    }
  };

  const handleDeleteClick = () => {
    setIsEditing(false);
    deleteVideo(video);
    navigate('/');
  };
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setNewTitle(currentTitle);
    setIsEditing(false);
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

  const handleCommentsChangeOnly = (newComments) => {
    setVideo({ ...video, comments: newComments })
  };

  const handleTextareaChange = () => {
    setNewTitle(textareaRef.current.value);
  };

  const handleProfileClick = (username) => {
    navigate(`/user/${username}`);
  };

  while (!(video && author)) {
    if (!video) {
      getVideo(id);
    }
    else if (!author) {
      getAuthorByUserName(video.username);
    }

    return <div>Loading...</div>;
  }

  return (
    <div className='PlayVideoScreen'>
      <div className="videoContainer">
        <video src={video.source} type="video/mp4" className="VideoPlayer" controls />
        {!isEditing && (
          <>
            <div className="videoTitle">{currentTitle}</div>

            <div className="videoProfile">
              <div className='clickable' onClick={() => handleProfileClick(author.username)} id="profilepicandname">
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
                      <span className="icon-text"> {video.likeCount}</span>
                    </button>
                  </div>
                )}

                {((isSignedIn && !liked) || !isSignedIn) && (
                  <div>
                    <button type="button" className="btn" onClick={handleLike}>
                      <i class="bi bi-hand-thumbs-up"></i>
                      <span className="icon-text"> {video.likeCount}</span>
                    </button>
                  </div>
                )}
                <button type="button" className="btn" onClick={handleShare}>
                  <i class="bi bi-share"></i>
                  <span id="shareVideo" className="icon-text"> Share</span>
                </button>

                {((isSignedIn.username === video.username)) && (
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
          <RelatedVideos id={id} videos={relatedVideos} />
        </div>
        <Comments
          videoId={video._id}
          isSignedIn={isSignedIn}
          onCommentsChangeOnly={handleCommentsChangeOnly}
        />
      </div>
      <div className="sidebarBig">
        <RelatedVideos id={id} videos={relatedVideos} />
      </div>
    </div>
  );
};

export default PlayVideoScreen;

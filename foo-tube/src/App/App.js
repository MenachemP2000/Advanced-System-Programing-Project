// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import TopBar from './TopBar/TopBar';
import Menu from './Menu/Menu';
import PlayVideoScreen from './PlayVideoScreen/PlayVideoScreen';
import Home from './Home/Home';
import DropDown from './DropDown/DropDown';
import SignIn from './SignIn/SignIn';
import './App.css';
import CreateAccount from './SignIn/CreateAccount';
import Search from './Search/Search';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [screen, setScreen] = useState(false);
  const [isSignedIn, setSignedInStatus] = useState(false);
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Fetch users data from server
    fetch('http://localhost:4000/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));

    // Fetch videos data from server
    fetch('http://localhost:4000/api/videos')
      .then(response => response.json())
      .then(data => setVideos(data))
      .catch(error => console.error('Error fetching videos:', error));
  }, []); // Empty dependency array ensures this runs only once

  const updateVideo = async (updatedVideo) => {
    try {
      const response = await fetch(`http://localhost:4000/api/videos/${updatedVideo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedVideo),
      });
      if (!response.ok) {
        throw new Error('Failed to update video');
      }
      const updatedVideoFromServer = await response.json();
      setVideos(prevVideos => prevVideos.map(video =>
        video._id === updatedVideoFromServer._id ? updatedVideoFromServer : video
      ));
    } catch (error) {
      console.error('Error updating video:', error);
    }
    console.log(videos);
  };

  // Function to add a new video to the server
  const addVideo = async (newVideo) => {
    try {
      const response = await fetch('http://localhost:4000/api/videos', {
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
  const deleteVideo = async (videoId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/videos/${videoId}`, {
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


  const likeVideo = async (videoId) => {
    try {
      const videoToUpdate = videos.find(video => video._id === videoId);
      if (!videoToUpdate) {
        throw new Error('Video not found');
      }
      const updatedVideo = {
        ...videoToUpdate,
        likeCount: videoToUpdate.likeCount + 1,
        usersLikes: [...videoToUpdate.usersLikes, isSignedIn]
      };
      await updateVideo(updatedVideo);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const unlikeVideo = async (videoId) => {
    try {
      const videoToUpdate = videos.find(video => video._id === videoId);
      if (!videoToUpdate) {
        throw new Error('Video not found');
      }
      const updatedVideo = {
        ...videoToUpdate,
        likeCount: Math.max(videoToUpdate.likeCount - 1, 0),
        usersLikes: videoToUpdate.usersLikes.filter(user => user !== isSignedIn._id)
      };
      await updateVideo(updatedVideo);
    } catch (error) {
      console.error('Error unliking video:', error);
    }
  };

  const likeComment = async (videoId, commentId) => {
    try {
      const videoToUpdate = videos.find(video => video._id === videoId);
      if (!videoToUpdate) {
        throw new Error('Video not found');
      }
      const updatedComments = videoToUpdate.comments.map(comment => {
        if (comment.id === commentId) {
          const newUsersLikes = [...comment.usersLikes, isSignedIn];
          return { ...comment, usersLikes: newUsersLikes };
        }
        return comment;
      });
      const updatedVideo = {
        ...videoToUpdate,
        comments: updatedComments
      };
      await updateVideo(updatedVideo);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const unlikeComment = async (videoId, commentId) => {
    try {
      const videoToUpdate = videos.find(video => video._id === videoId);
      if (!videoToUpdate) {
        throw new Error('Video not found');
      }
      const updatedComments = videoToUpdate.comments.map(comment => {
        if (comment.id === commentId) {
          const newUsersLikes = comment.usersLikes.filter(user => user !== isSignedIn);
          return { ...comment, usersLikes: newUsersLikes };
        }
        return comment;
      });
      const updatedVideo = {
        ...videoToUpdate,
        comments: updatedComments
      };
      await updateVideo(updatedVideo);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };


  const handleVideoChange = (newVideo) => {
    updateVideo(newVideo);
  };

  const handleVideoDelete = (oldVideo) => {
    deleteVideo(oldVideo._id);
  };



  const addUser = (user) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropDown = () => {
    setDropDownOpen(!dropDownOpen);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleSignendIn = (username) => {
    if (username) {
      setSignedInStatus(users.find(user => user.username === username));
    }
    else {
      setSignedInStatus(false);
    }
  };

  const toggleScreen = (screen) => {
    setScreen(screen);
  };

  return (
    <Router>
      <div className={`App ${theme}`}>
        {!(screen == "SignIn" || screen == "CreateAccount") && (
          <>
            <TopBar theme={theme} toggleMenu={toggleMenu} toggleDropDown={toggleDropDown} isSignedIn={isSignedIn} />
            <Menu screen={screen} isOpen={menuOpen} />
            <DropDown setIsOpen={setDropDownOpen} isOpen={dropDownOpen} isSignedIn={isSignedIn} toggleTheme={toggleTheme} toggleSignendIn={toggleSignendIn} />
            {(menuOpen && screen != "Home") && (<div className="Overlay" onClick={toggleMenu}></div>)}
          </>
        )}

        <Routes>
          <Route path="/search/:key" element={<Search users={users} toggleScreen={toggleScreen} videos={videos} />} />
          <Route path="/signin" element={<SignIn users={users} setUsers={setUsers} toggleScreen={toggleScreen} isSignedIn={isSignedIn} toggleSignendIn={toggleSignendIn} />} />
          <Route path="/createaccount" element={<CreateAccount setSignedInStatus={setSignedInStatus} users={users} addUser={addUser} isSignedIn={isSignedIn} toggleScreen={toggleScreen} toggleSignendIn={toggleSignendIn} />} />
          <Route path="/" element={<Home toggleScreen={toggleScreen}
            videos={videos}
            isSignedIn={isSignedIn}
            menuOpen={menuOpen}
            users={users}
          />} />
          <Route path="/video/:id" element={<PlayVideoScreen
            videos={videos}
            unlikeVideo={unlikeVideo}
            likeVideo={likeVideo}
            users={users}
            toggleScreen={toggleScreen}
            isSignedIn={isSignedIn}
            unlikeComment={unlikeComment}
            likeComment={likeComment}
            onVideoChange={handleVideoChange}
            onVideoDelete={handleVideoDelete}
          />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;


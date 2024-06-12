// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import TopBar from './TopBar/TopBar';
import Menu from './Menu/Menu';
import PlayVideoScreen from './PlayVideoScreen/PlayVideoScreen';
import Home from './Home/Home';
import DropDown from './DropDown/DropDown';
import SignIn from './SignIn/SignIn';
import './App.css';
import CreateAccount from './SignIn/CreateAccount';
import UserData from './SignIn/users.json'
import videoData from './PlayVideoScreen/MetaData/videos.json'; // Corrected the import path
import Search from './Search/Search';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [screen, setScreen] = useState(false);
  const [isSignedIn, setSignedInStatus] = useState(false);
  const [users, setUsers] = useState(UserData);
  const [videos, setVideos] = useState(videoData.videos);

  
  useEffect(() => {
    console.log(videos);
  }, [videos]);
  

  const likeVideo = (videoId) => {
    setVideos(prevVideos => {
      return prevVideos.map(video => {
        if (video.id === videoId) {
          const newLikeCount = video.likeCount + 1;
          const newUsersLikes = [...video.usersLikes, isSignedIn];
          return { ...video, likeCount: newLikeCount, usersLikes: newUsersLikes };
        }
        return video;
      });
    });
  };

  const unlikeVideo = (videoId) => {
    setVideos(prevVideos => {
      return prevVideos.map(video => {
        if (video.id === videoId) {
          const newLikeCount = Math.max(video.likeCount - 1, 0);
          const newUsersLikes = video.usersLikes.filter(user => user !== isSignedIn);
          return { ...video, likeCount: newLikeCount, usersLikes: newUsersLikes };
        }
        return video;
      });
    });
  };

  const likeComment = (videoId, commentId) => {
    setVideos(prevVideos => {
      return prevVideos.map(video => {
        if (video.id === videoId) {
          const updatedComments = video.comments.map(comment => {
            if (comment.id === commentId) {
              const newUsersLikes = [...comment.usersLikes, isSignedIn];
              return { ...comment, usersLikes: newUsersLikes };
            }
            return comment;
          });
          return { ...video, comments: updatedComments };
        }
        return video;
      });
    });
  };

  const unlikeComment = (videoId, commentId) => {
    setVideos(prevVideos => {
      return prevVideos.map(video => {
        if (video.id === videoId) {
          const updatedComments = video.comments.map(comment => {
            if (comment.id === commentId) {
              const newUsersLikes = comment.usersLikes.filter(user => user !== isSignedIn);
              return { ...comment, usersLikes: newUsersLikes };
            }
            return comment;
          });
          return { ...video, comments: updatedComments };
        }
        return video;
      });
    });
  };

  const handleVideoChange = (newVideo) => {
    setVideos(prevVideos => {
      const videoIndex = prevVideos.findIndex(video => video.id === newVideo.id);
      if (videoIndex !== -1) {
        return prevVideos.map((video, index) => index === videoIndex ? newVideo : video);
      } else {
        return [...prevVideos, newVideo];
      }
    });
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
        {!(screen == "SignIn" || screen == "CreateAccount" ) && (
          <>
            <TopBar theme={theme} toggleMenu={toggleMenu} toggleDropDown={toggleDropDown} isSignedIn={isSignedIn} />
            <Menu screen={screen} isOpen={menuOpen}  />
            <DropDown setIsOpen={setDropDownOpen} isOpen={dropDownOpen} isSignedIn={isSignedIn} toggleTheme={toggleTheme} toggleSignendIn={toggleSignendIn} />
            {(menuOpen && screen != "Home" ) &&(<div className="Overlay" onClick={toggleMenu}></div>) }
          </>
        )}

        <Routes>
           <Route path="/search/:key" element={<Search users={users} toggleScreen={toggleScreen}  videos={videos} />} />
          <Route path="/signin" element={<SignIn users={users} setUsers={setUsers} toggleScreen={toggleScreen} isSignedIn={isSignedIn} toggleSignendIn={toggleSignendIn} />} />
          <Route path="/createaccount" element={<CreateAccount setSignedInStatus={setSignedInStatus} users={users} addUser={addUser} isSignedIn={isSignedIn} toggleScreen={toggleScreen} toggleSignendIn={toggleSignendIn} />} />
          <Route path="/" element={<Home toggleScreen={toggleScreen} 
            videos={videos}
            videoData={videoData}
            isSignedIn={isSignedIn}
            menuOpen={menuOpen}
            users ={users}
            />} />
          <Route path="/video/:id" element={<PlayVideoScreen
            videos={videos}
            videoData={videoData}
            unlikeVideo={unlikeVideo}
            likeVideo={likeVideo}
            users={users}
            toggleScreen={toggleScreen}
            isSignedIn={isSignedIn}
            unlikeComment={unlikeComment}
            likeComment={likeComment}
            onVideoChange={handleVideoChange}
          />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const UserBox = ({ video }) => {
    const [author, setAuthor] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        getAuthorByUserName(video.username);
    }, [video]);

    const getAuthorByUserName = async (username) => {
        try {
            const response = await fetch(`http://localhost:4000/api/users/username/${username}`, {
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

    const handleVideoClick = (id) => {
        navigate(`/video/${id}`);
    };

    const handleProfileClick = (username) => {
        navigate(`/user/${username}`);
    };
    while (!(author)) {
        getAuthorByUserName(video.username);
        return <div>Loading...</div>;
    }

    return (
        <li className='clickable userVideos' key={video._id} onClick={() => handleVideoClick(video._id)}>
            <img className='thumbNail' src={video.thumbnail} alt={video.title} />
            <div className="video-info">
                <h3>{video.title}</h3>
                <p>{video.views} views</p>
                <div className='profileUserVideos' onClick={(event) => {
                    event.stopPropagation();
                    handleProfileClick(video.username);
                }}>
                    <img className='profliePic' src={author.image} height="24px" width="24px" ></img>
                    <p >{video.username}</p>
                </div>

                <p>{video.description}</p>
            </div>
        </li>
    );
};

export default UserBox;
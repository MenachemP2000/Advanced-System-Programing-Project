import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const RecommendedBox = ({ video }) => {
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
        <li className='clickable' key={video._id} onClick={() => handleVideoClick(video._id)}>
            <img className='thumbNail' src={video.thumbnail} alt={video.title} />
            <div className='videoDetails'>
                <img onClick={(event) => {
                    event.stopPropagation();
                    handleProfileClick(video.username);
                }} src={author.image} height="35px" width="35px" ></img>
                <div className="video-info">
                    <h3>{video.title}</h3>
                    <p onClick={(event) => {
                        event.stopPropagation();
                        handleProfileClick(video.username);
                    }}>{video.username}</p>
                    <p>{video.views} views</p>
                </div>
            </div>
        </li>
    );
};

export default RecommendedBox;
import React, { useState } from 'react';
import './AddVideo.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const AddVideo = ({ onAddVideo, handleAddVideo, isSignedIn, videos }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null); // State to hold the selected thumbnail file
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoError, setVideoError] = useState('');
  const [thumbnailError, setThumbnailError] = useState('');
  const navigate = useNavigate();

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        setVideoError('');

        // Optional: Create a video preview if needed
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Log to check if video file is set
        console.log('Video file selected:', file);
      } else {
        setVideoFile(null);
        setVideoPreview(null);
        setVideoError('Please select a valid video file.');
      }
    } else {
      setVideoFile(null);
      setVideoPreview(null);
      setVideoError('');
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setThumbnailFile(file);
        setThumbnailError('');

        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnailPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Log to check if thumbnail file is set
        console.log('Thumbnail file selected:', file);
      } else {
        setThumbnailFile(null);
        setThumbnailPreview(null);
        setThumbnailError('Please select a valid image file.');
      }
    } else {
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setThumbnailError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!videoFile) {
      alert('Please select a video file.');
      return;
    }

    if (!thumbnailFile) {
      alert('Please select a thumbnail image.');
      return;
    }

    if (videoError || thumbnailError) {
      alert('Please fix the errors before submitting.');
      return;
    }

  const today = new Date();
  const year = today.getFullYear();
  const month = ('0' + (today.getMonth() + 1)).slice(-2); // Ensures two digits for month
  const day = ('0' + today.getDate()).slice(-2); // Ensures two digits for day

  const uploadDate = `${year}-${month}-${day}`;

    const numberOfVideos = videos.length;
    const newVideoId = (numberOfVideos + 1).toString();

    const newVideo = {
      id: newVideoId,
      title,
      description,
      videoFile,
      thumbnailFile,
      tags: tags.trim().split(',').map(tag => tag.trim()),
      upload_date: uploadDate, 
      duration: "00:10", // Example duration
      username: isSignedIn.username, 
      likeCount: 0,
      views: 0,
      usersLikes: [],
      comments: [],
    };

    onAddVideo(newVideo);
    setTitle('');
    setDescription('');
    setTags('');
    setVideoFile(null);
    setThumbnailFile(null);
    navigate("/");
  };

  return (
    <div className="add-video">
      <h2>Add New Video</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>
        <div>
          <label>Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., technology, tutorial, coding"
          />
        </div>
        <div>
          <label>Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            required
          />
          {videoError && <div className="error">{videoError}</div>}
        </div>
        <div>
          <label>Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            required
          />
          {thumbnailError && <div className="error">{thumbnailError}</div>}
        </div>
        <button type="submit">Add Video</button>
      </form>
    </div>
  );
};

export default AddVideo;

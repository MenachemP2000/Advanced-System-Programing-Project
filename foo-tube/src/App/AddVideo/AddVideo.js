import React, { useState } from 'react';
import './AddVideo.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const AddVideo = ({ onAddVideo, handleAddVideo, isSignedIn, videos }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(''); // State for thumbnail error message
  const [videoError, setVideoError] = useState(''); // State for video error message
  const navigate = useNavigate();

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setVideoError('Please select a video file.');
        setVideoFile(null);
        setVideoPreview(null);
        return;
      }
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
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (should be an image)
      if (!file.type.startsWith('image/')) {
        setThumbnailError('Please select an image file.');
        setThumbnailFile(null);
        setThumbnailPreview(null);
        return;
      }

      setThumbnailFile(file);
      setThumbnailError('');

      // Optional: Create a thumbnail preview if needed
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
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let hasError = false;

    if (!videoFile) {
      setVideoError('Please select a video file.');
      hasError = true;
    }

    if (!thumbnailFile) {
      setThumbnailError('Please select a image file.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const numberOfVideos = videos.length;
    const newVideoId = (numberOfVideos + 1).toString();

    // Perform additional validations if needed
    const newVideo = {
      id: newVideoId, // Example ID, adjust as needed
      title,
      description,
      videoFile,
      thumbnailFile,
      tags: tags.trim().split(',').map(tag => tag.trim()),
      upload_date: new Date().toISOString().slice(0, 10), // Example: Current date
      duration: "00:10", // Example duration
      username: isSignedIn.username, // Example username
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
          {videoError && <p className="error-message">{videoError}</p>}
        </div>
        <div>
          <label>Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            required
          />
          {thumbnailError && <p className="error-message">{thumbnailError}</p>}
        </div>
        <button type="submit">Add Video</button>
      </form>
    </div>
  );
};

export default AddVideo;


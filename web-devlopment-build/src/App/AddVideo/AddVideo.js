import React, { useState } from 'react';
import './AddVideo.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const AddVideo = ({ isSignedIn }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoError, setVideoError] = useState('');
  const [thumbnailError, setThumbnailError] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setVideoError('Please select a valid video file.');
        setVideoFile(null);
        return;
      }
      setVideoFile(file);
      setVideoError('');
    } else {
      setVideoFile(null);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setThumbnailError('Please select a valid image file.');
        setThumbnailFile(null);
        return;
      }
      setThumbnailFile(file);
      setThumbnailError('');
    } else {
      setThumbnailFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (!videoFile) {
      setVideoError('Please select a video file.');
      hasError = true;
    }

    if (!thumbnailFile) {
      setThumbnailError('Please select a thumbnail image file.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const duration = "00:10"; // Fixed duration of 10 seconds
    const upload_date = new Date().toISOString(); // Get the current date and time

    const convertFileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    try {
      const base64Video = await convertFileToBase64(videoFile);
      const base64Thumbnail = await convertFileToBase64(thumbnailFile);

      const payload = {
        title,
        description,
        tags: tags.trim().split(',').map(tag => tag.trim()),
        source: base64Video,
        thumbnail: base64Thumbnail,
        username: isSignedIn.username,
        duration,
        upload_date,
      };

      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setVideoError(result.message || 'Failed to upload video.');
        return;
      }

      navigate("/");
    } catch (error) {
      setVideoError('An error occurred. Please try again.');
      console.error('Error uploading video:', error);
    }
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
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Add Video</button>
      </form>
    </div>
  );
};

export default AddVideo;

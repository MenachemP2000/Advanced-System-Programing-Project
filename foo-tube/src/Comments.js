// Comments.js

import React, { useState } from 'react';
import './Comments.css';

const Comments = () => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]); // Initial comments
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim() !== '') {
      if (editingIndex !== null) {
        // If editing an existing comment
        const updatedComments = [...comments];
        updatedComments[editingIndex] = newComment;
        setComments(updatedComments);
        setEditingIndex(null);
      } else {
        // If adding a new comment
        setComments([...comments, newComment]);
      }
      setNewComment('');
    }
  };

  const handleEditComment = (index) => {
    setNewComment(comments[index]);
    setEditingIndex(index);
  };

  const handleDeleteComment = (index) => {
    const updatedComments = [...comments];
    updatedComments.splice(index, 1);
    setComments(updatedComments);
  };

  return (
    <div className="Comments">
      <h2>Comments</h2>
      <form onSubmit={handleAddComment}>
        <textarea 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add your comment..."
          style={{ width: '100%' }}
        ></textarea>
        <div className="button-container">
          {editingIndex !== null && (
            <button type="button" className="btn btn-primary" onClick={() => setEditingIndex(null)}>Cancel</button>
          )}
          <button className="btn btn-primary" type="submit">{editingIndex !== null ? 'Update Comment' : 'Add Comment'}</button>
        </div>
      </form>
      {comments.map((comment, index) => (
        <div className="comment" key={index}>
          <p>{comment}</p>
          <div className="button-container">
            <button type="button" class="btn btn-primary" onClick={() => handleEditComment(index)}>Edit</button>
            <button type="button" class="btn btn-primary" onClick={() => handleDeleteComment(index)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comments;

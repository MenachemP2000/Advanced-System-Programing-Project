import React, { useState, useEffect } from 'react';
import './CreateAccount.css';
import { useNavigate } from 'react-router-dom';

const CreateAccount = ({ addUser, toggleSignendIn, toggleScreen, isSignedIn, users }) => {
    const [displayname, setDisplayname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [error, setError] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        toggleScreen("CreateAccount");
        if (isSignedIn) {
            navigate("/");
        }
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImage('');
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const displaynameWords = displayname.trim().split(/\s+/);
        if (displaynameWords.length < 2) {
            setError('Must input first and last name');
            return;
        }
        const user = users.find(user => user.username === username);
        if (user) {
            setError('Username already taken');
            return;
        }

        if (username === '' || password === '' || !image) {
            setError('All fields are required');
            return;
        }

        if (password !== passwordAgain) {
            setError('Password fields do not match!');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        if (!hasLetter || !hasNumber) {
            setError('Password must contain both letters and numbers');
            return;
        }
        const newUser = {username, displayname, password, image };

        addUser(newUser);

        toggleSignendIn(username);
        toggleScreen("SignIN");
        navigate("/signin");
    };

    return (
        <div className="container">
            <div className="create-account-box">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="displayname">First and last Name</label>
                        <input
                            type="text"
                            id="displayname"
                            placeholder="Enter both first and last name"
                            value={displayname}
                            onChange={(e) => setDisplayname(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter a unique Username "
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password length need to be atleast 8"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="passwordAgain">Retype Password</label>
                        <input
                            type="password"
                            id="passwordAgain"
                            placeholder="Include both letters and numbers "
                            value={passwordAgain}
                            onChange={(e) => setPasswordAgain(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="image">Profile Image</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="create-account">Create Account</button>
                    
                </form>
            </div>
        </div>
    );
};

export default CreateAccount;

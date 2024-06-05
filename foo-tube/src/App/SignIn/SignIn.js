import React, { useState, useEffect } from 'react';
import './SignIn.css';
import UserData from './users.json'
import { useNavigate } from 'react-router-dom';



const SignIn = ({ toggleScreen, toggleSignendIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();



    const handleSubmit = (e) => {
        e.preventDefault();

        const user = UserData.find(user => user.username === username && user.password === password);

        if (user) {
            toggleSignendIn(user.username);
            toggleScreen("Home")
            navigate("/"); // Navigate to the home page
        } else {
            console.log('Invalid username or password');
        }
    };

    useEffect(() => {
        toggleScreen("SignIn");
    }, []);

    return (
        <div className="container">
            <div className="signin-box">
                <h2>Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className='SignIn'>Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default SignIn;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import config from '../config';




const SignIn = ({ toggleScreen, isSignedIn, toggleSignendIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorUserName, setErrorUserName] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [userNameGood, toggleUserNameGood] = useState(false);
    const [user, setUser] = useState(false)
    const navigate = useNavigate();
    const getUserByUserName = async (username) => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/api/users/username/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const userFromServer = await response.json();
            setUser(userFromServer);
            return userFromServer;
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignedIn) {
            toggleScreen("Home")
            navigate("/");
        }
        else {
            if (user.password === password) {
                toggleSignendIn(user.username);
                toggleScreen("Home")
                navigate("/"); // Navigate to the home page
            } else {
                setErrorPassword(true);
            }
        }
    };

    const handleCreateAccount = () => {
        toggleScreen("CreateAccount")
        navigate("/createaccount");

    };

    const handleUserName = async (e) => {
        e.preventDefault();
        try {
            const userSigningIn = (await getUserByUserName(username));
            if (userSigningIn) {
                toggleUserNameGood(true);
                setErrorUserName(false);
            } else {
                setErrorUserName(true);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        toggleScreen("SignIn");
    });

    return (
        <div className='container'>
            <div className="signin-box">
                <h2>Sign In</h2>
                {!userNameGood && (
                    <form onSubmit={handleUserName}>
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
                        <div className="userNameButtons">

                            <button type="button" className="SignIn btn   " onClick={handleCreateAccount}>Create account</button>
                            <button type="submit" className='SignIn btn   '>Next</button>

                        </div>
                    </form>
                )}
                {userNameGood && (
                    <form onSubmit={handleSubmit}>
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
                        <button type="submit" className='SignIn btn   '>Next</button>
                    </form>
                )}
            </div>
            {errorUserName && <div className="error-message">Couldn't find your FooTube Account</div>}
            {errorPassword && <div className="error-message">Wrong password. Try again.</div>}
        </div>
    );
};

export default SignIn;

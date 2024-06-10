import React, { useState, useEffect } from 'react';
import './SignIn.css';
import { useNavigate } from 'react-router-dom';



const SignIn = ({ toggleScreen, isSignedIn, toggleSignendIn,users}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorUserName, setErrorUserName] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [userNameGood, toggleUserNameGood] = useState(false);
    const navigate = useNavigate();



    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignedIn) {
            toggleScreen("Home")
            navigate("/");
        }
        else {
            const user = users.find(user => user.username === username && user.password === password);
            if (user) {
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
    

    const handleUserName = (e) => {
        e.preventDefault();
        const user = users.find(user => user.username === username);
        if (user) {
            toggleUserNameGood(true);
            setErrorUserName(false);
        } else {
            setErrorUserName(true);
        }
    };

    useEffect(() => {
        toggleScreen("SignIn");
    }, []);

    return (
        <div>
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

                            <button type="button" className="SignIn btn btn-primary " onClick={handleCreateAccount}>Create account</button>
                            <button type="submit" className='SignIn btn btn-primary '>Next</button>

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
                        <button type="submit" className='SignIn btn btn-primary '>Next</button>
                    </form>
                )}
            </div>
            {errorUserName && <div className="error-message">Couldn't find your FooTube Account</div>}
            {errorPassword && <div className="error-message">Wrong password. Try again.</div>}
        </div>
    );
};

export default SignIn;

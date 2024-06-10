import { React, useEffect } from 'react';
import { Link } from 'react-router-dom';


const Home = ({toggleScreen}) => {


  useEffect(() => {
    toggleScreen("Home");
  }, []);
  return (
    <div>
      <h1>Welcome to My Website</h1>
      <p>This is the home page of my website. You can navigate to other pages using the menu or by typing the URL directly.</p>
      <p>Feel free to explore!</p>
      <Link to="/video/1" className="btn btn-primary" >Video</Link>

    </div>
  );
};

export default Home;

import React from 'react';
import './Home.css';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  return (
    <div className="home-container">
      {user && <div className="user-greeting">Hello, {user.name}!</div>}
      <h1 className="home-title">Welcome to the Home Page</h1>
      <p className="home-message">
        This is a protected page that only logged-in users can see. 
        You're seeing this because you've successfully authenticated.
      </p>
    </div>
  );
};

export default Home
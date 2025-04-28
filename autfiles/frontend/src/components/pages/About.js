import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">About Us</h1>
      <div className="about-content">
        <p>
          This is a public about page that anyone can access. 
          Our application provides secure authentication with React and Node.js.
        </p>
        <p>
          The frontend is built with React and deployed on Vercel, 
          while the backend runs on Node.js with Express and is hosted on Render.
        </p>
      </div>
    </div>
  );
};

export default About
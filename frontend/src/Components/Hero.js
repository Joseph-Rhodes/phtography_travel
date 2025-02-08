import React from 'react';
import './Hero.css';
import heroImage from '../Images/IMG_6985.png'; // Replace with the uploaded image

const Hero = () => {
  return (
    <div
      className="hero"
      style={{
        backgroundImage: `url(${heroImage})`
      }}
    >
      <h1 className="hero-text">Explore, Click, Repeat</h1>
    </div>
  );
};

export default Hero;

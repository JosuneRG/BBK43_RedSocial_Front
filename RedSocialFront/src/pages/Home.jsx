import React from 'react';
import Posts from '../components/Posts/Post';
import '../styles/home.scss';

const Home = () => {
  return (
    <div className="home">
      <h1>Home</h1>
      <div className="posts-container">
        <Posts />
      </div>
    </div>
  );
};

export default Home;

import React from 'react';
import Post from '../components/Posts/Post';
import '../styles/home.scss';

const Home = () => {
  return (
    <div className="home">
      <h1>Explora, comparte y aprende con la comunidad</h1>
      <div className="posts-container">
        <Post/>
      </div>
    </div>
  );
};

export default Home;

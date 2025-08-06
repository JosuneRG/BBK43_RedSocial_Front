import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Post = () => {
  const { posts } = useSelector((state) => state.posts);

  if (!posts || posts.length === 0) return <p>No hay posts.</p>;

  return (
    <>
      {posts.map((post, index) => (
        <div key={post._id} className="post">
          <Link to={`/post/${post._id}`}>Post nº {index + 1}</Link>
          <p>{post.content}</p>
          <img
            src={`http://localhost:3000/${post.post_img}`}
            alt="post-img"
            width="300px"
          />
        </div>
      ))}
    </>
  );
};

export default Post;

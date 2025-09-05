import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAll } from "../../redux/posts/postsSlice";
import '../../styles/Posts.scss';

const Posts = () => {
  const dispatch = useDispatch();
  const { isLoading, posts } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);

  if (isLoading) return <p>Cargando...</p>;
  if (!posts || posts.length === 0) return <p>No hay posts.</p>;

  return (
    <div className="posts-grid">
      {posts.map((post) => (
        <article key={post._id} className="post-card">
          <Link to={`/post/${post._id}`} className="post-title">
            {post.title || 'Sin título'}
          </Link>
          {post.image && (
            <img
              src={`http://localhost:3000/${post.image}`}
              alt={post.title || 'post'}
              className="post-image"
            />
          )}
          <p className="post-content">{post.content}</p>
          <div className="post-meta">
            <span>❤️ {post.likes?.length || 0}</span>
            <span>💬 {post.comments?.length || 0}</span>
          </div>
        </article>
      ))}
    </div>
  );
};

export default Posts;

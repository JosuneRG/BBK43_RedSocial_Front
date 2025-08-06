import React, { useEffect } from 'react';
import Post from './Post';
import { useDispatch, useSelector } from 'react-redux';
import { getAll } from '../../redux/posts/postsSlice';

const Posts = () => {
  const dispatch = useDispatch();
  const { isLoading, posts } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);

  if (isLoading) return <p>Cargando...</p>;
  if (!posts || posts.length === 0) return <p>No hay posts.</p>;

  return (
    <>
      <h1>Posts</h1>
      <Post />
    </>
  );
};

export default Posts;

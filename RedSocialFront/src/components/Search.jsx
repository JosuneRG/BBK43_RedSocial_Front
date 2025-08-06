import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostByName } from '../redux/posts/postsSlice';

const Search = () => {
  const { posts } = useSelector((state) => state.posts);
  const { postName } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [text, setText] = useState('');

  useEffect(() => {
    if (postName) {
      dispatch(getPostByName(postName));
    }
  }, [postName, dispatch]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search/${text}`);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar post"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <div>
        {posts?.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post">
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <img
                src={`http://localhost:3000/${post.post_img}`}
                width="350px"
                alt="post"
              />
            </div>
          ))
        ) : (
          <p>No se encontraron posts con ese nombre.</p>
        )}
      </div>
    </div>
  );
};

export default Search;

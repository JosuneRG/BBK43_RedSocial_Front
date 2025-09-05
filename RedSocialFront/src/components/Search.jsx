// src/pages/Search.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostByName } from '../redux/posts/postsSlice';
import { searchUsers } from '../redux/users/usersSlice';

const Search = () => {
  const { postName } = useParams(); // usamos la misma url para posts y users
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { posts } = useSelector((s) => s.posts);
  const { results: users } = useSelector((s) => s.users);

  const [text, setText] = useState(postName || '');

  useEffect(() => {
    if (postName) {
      dispatch(getPostByName(postName));
      dispatch(searchUsers(postName));
    }
  }, [postName, dispatch]);

  const goSearch = () => {
    if (!text.trim()) return;
    navigate(`/search/${encodeURIComponent(text.trim())}`);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') goSearch();
  };

  return (
    <div style={{ padding: '1rem', maxWidth: 1000, margin: '0 auto' }}>
      <h1>Resultados de búsqueda</h1>

      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar posts o usuarios…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          style={{ flex: 1, padding: '.6rem .8rem' }}
        />
        <button onClick={goSearch}>Buscar</button>
      </div>

      <h2>Usuarios</h2>
      {users?.length ? (
        <ul style={{ display: 'grid', gap: '.5rem', padding: 0, listStyle: 'none', marginBottom: '1rem' }}>
          {users.map(u => (
            <li key={u._id} style={{ background: '#fff', padding: '.75rem 1rem', borderRadius: 10 }}>
              <strong>@{u.username}</strong> — {u.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron usuarios.</p>
      )}

      <h2>Posts</h2>
      {posts?.length ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {posts.map((post) => (
            <div key={post._id} className="post" style={{ background: '#fff', borderRadius: 10, padding: '1rem' }}>
              <Link to={`/post/${post._id}`}><h3>{post.title || 'Sin título'}</h3></Link>
              <p>{post.content}</p>
              {post.image && (
                <img
                  src={`http://localhost:3000/${post.image}`}
                  width="350"
                  alt={post.title || 'post'}
                  style={{ borderRadius: 8 }}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No se encontraron posts.</p>
      )}
    </div>
  );
};

export default Search;

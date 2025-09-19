// src/pages/Search.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { getPostByName } from '../redux/posts/postsSlice';
import { searchUsers, clearSearch } from '../redux/users/usersSlice';
import FollowButton from '../components/Follow/FollowButton';
import DMWindow from '../components/Chat/DMWindow'; // ✅ usa tu componente real
import '../styles/Search.scss';

const Search = () => {
  const dispatch = useDispatch();

  // Compatibilidad con el patrón viejo /search/:postName
  const { postName: legacyParam } = useParams();
  const [sp, setSp] = useSearchParams();

  // Estado local para el input
  const [text, setText] = useState(sp.get('q') || legacyParam || '');
  const type = sp.get('type') || 'posts'; // 'posts' | 'users'

  // Estado para abrir el chat con un usuario
  const [peer, setPeer] = useState(null);

  // Redux
  const { posts, isLoading: loadingPosts } = useSelector((s) => s.posts);
  const { searchResults, isLoading: loadingUsers } = useSelector((s) => s.users);

  // Dispara búsquedas cuando cambian q/type o legacy
  useEffect(() => {
    const q = sp.get('q') || legacyParam || '';
    const t = sp.get('type') || 'posts';

    if (!q) {
      dispatch(clearSearch());
      return;
    }

    if (t === 'posts') {
      dispatch(getPostByName(q));
    } else {
      dispatch(searchUsers(q));
    }
  }, [sp, legacyParam, dispatch]);

  // Enviar búsqueda
  const onSearch = (e) => {
    e?.preventDefault?.();
    const q = text.trim();
    if (!q) return;
    setSp({ q, type }); // usa query params
  };

  // Cambiar pestaña (posts/users)
  const switchType = (newType) => {
    const q = (sp.get('q') || legacyParam || '').trim();
    setSp(q ? { q, type: newType } : { type: newType });
  };

  const loading = useMemo(() => {
    return type === 'posts' ? loadingPosts : loadingUsers;
  }, [type, loadingPosts, loadingUsers]);

  return (
    <div className="search-page">
      <h1>Buscar</h1>

      <form className="search-bar" onSubmit={onSearch}>
        <input
          type="text"
          placeholder={type === 'posts' ? 'Buscar posts…' : 'Buscar usuarios…'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch(e);
          }}
        />
        <button type="submit">Buscar</button>
      </form>

      <div className="tabs">
        <button
          className={`tab ${type === 'posts' ? 'active' : ''}`}
          onClick={() => switchType('posts')}
        >
          Posts
        </button>
        <button
          className={`tab ${type === 'users' ? 'active' : ''}`}
          onClick={() => switchType('users')}
        >
          Usuarios
        </button>
      </div>

      {/* Resultados */}
      <div className="results">
        {loading && <p className="muted">Buscando…</p>}

        {!loading && (sp.get('q') || legacyParam) && type === 'posts' && (
          posts?.length ? (
            <div className="grid">
              {posts.map((p) => (
                <div className="card" key={p._id}>
                  <Link to={`/post/${p._id}`}>
                    <h3>{p.title || 'Sin título'}</h3>
                  </Link>
                  <p className="excerpt">{p.content}</p>
                  {p.image && (
                    <img
                      src={`http://localhost:3000/${p.image}`}
                      alt=""
                      className="thumb"
                    />
                  )}
                  <div className="meta">
                    <span>👤 {typeof p.user === 'object' ? p.user.username : '—'}</span>
                    <span>💬 {Array.isArray(p.comments) ? p.comments.length : 0}</span>
                    <span>❤️ {Array.isArray(p.likes) ? p.likes.length : 0}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">No se encontraron posts.</p>
          )
        )}

        {!loading && (sp.get('q') || legacyParam) && type === 'users' && (
          searchResults?.length ? (
            <div className="list">
              {searchResults.map((u) => (
                <div key={u._id} className="row">
                  <img
                    className="avatar"
                    src={
                      u.avatar
                        ? `http://localhost:3000/${u.avatar}`
                        : 'https://i.ibb.co/2kR8Yqr/default-avatar.png'
                    }
                    alt={u.username}
                  />
                  <div className="usercol">
                    <strong>@{u.username}</strong>
                    <span className="muted">{u.email}</span>
                  </div>

                  {/* Acciones: Seguir + Mensaje */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <FollowButton targetUserId={u._id} />
                    <button
                      className="btn msg-btn"
                      onClick={() => setPeer(u)}
                      style={{
                        padding: '.45rem .8rem',
                        borderRadius: '8px',
                        border: '1px solid #0a66ff',
                        background: '#f0f6ff',
                        color: '#0a66ff',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                      title={`Chatear con @${u.username}`}
                    >
                      💬 Mensaje
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">No se encontraron usuarios.</p>
          )
        )}
      </div>

      {/* Ventana de chat (se monta al elegir un usuario) */}
      {peer && <DMWindow peer={peer} onClose={() => setPeer(null)} />}
    </div>
  );
};

export default Search;

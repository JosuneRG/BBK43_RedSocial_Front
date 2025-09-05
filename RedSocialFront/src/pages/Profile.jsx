// src/pages/Profile.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyProfile } from '../redux/users/usersSlice';
import { getAll } from '../redux/posts/postsSlice';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const { me, isLoading } = useSelector((s) => s.users);

  const [myPosts, setMyPosts] = React.useState([]);

  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  useEffect(() => {
    const fetchMine = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('token'));
        if (!token) return;
        const res = await axios.get('http://localhost:3000/posts/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyPosts(res.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMine();
  }, []);

  if (isLoading && !me) return <p style={{ padding: 16 }}>Cargando perfil…</p>;
  if (!me) return <p style={{ padding: 16 }}>Inicia sesión para ver tu perfil.</p>;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>Mi perfil</h1>

      <div style={{
        background: '#fff', borderRadius: 12, padding: '1rem 1.2rem',
        marginBottom: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,.06)'
      }}>
        <p><strong>Usuario:</strong> {me.username}</p>
        <p><strong>Email:</strong> {me.email}</p>
        {me.bio && <p><strong>Bio:</strong> {me.bio}</p>}
      </div>

      <h2>Mis publicaciones</h2>
      {myPosts.length ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {myPosts.map(p => (
            <div key={p._id} style={{ background: '#fff', borderRadius: 12, padding: '1rem' }}>
              <Link to={`/post/${p._id}`}><h3>{p.title || 'Sin título'}</h3></Link>
              <p>{p.content}</p>
              {p.image && <img src={`http://localhost:3000/${p.image}`} width="320" alt="" style={{ borderRadius: 8 }} />}
            </div>
          ))}
        </div>
      ) : (
        <p>No tienes publicaciones aún.</p>
      )}
    </div>
  );
};

export default Profile;

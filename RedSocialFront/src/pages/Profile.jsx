// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMyProfile,
  updateProfile,
  updatePassword,
  updateAvatar,
  fetchMyNetwork, // 👈 contador + listas
} from '../redux/users/usersSlice';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FollowButton from '../components/Follow/FollowButton';
import '../styles/profile.scss';

const API_BASE = 'http://localhost:3000';

// Enmascarar email para privacidad
const maskEmail = (email = '') => {
  const [name, domain] = email.split('@');
  if (!domain) return email;
  const masked =
    name.length <= 2
      ? name[0] + '*'
      : name[0] + '*'.repeat(Math.max(1, name.length - 2)) + name[name.length - 1];
  return `${masked}@${domain}`;
};

const Profile = () => {
  const dispatch = useDispatch();
  const { me, isLoading, network } = useSelector((s) => s.users);

  const [myPosts, setMyPosts] = useState([]);

  // estados de edición
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', bio: '' });

  // contraseña
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '' });

  // avatar
  const [avatarPreview, setAvatarPreview] = useState('');

  // toggles de listas
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  // cargar perfil + red (followers/following)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getMyProfile());
      dispatch(fetchMyNetwork()); // 👈 carga contadores y listas
    }
  }, [dispatch]);

  // cargar posts del usuario logueado
  useEffect(() => {
    const fetchMine = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get(`${API_BASE}/posts/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyPosts(res.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMine();
  }, []);

  // actualizar estados con datos del perfil
  useEffect(() => {
    if (me) {
      setForm({
        username: me.username || '',
        email: me.email || '',
        bio: me.bio || '',
      });
      setAvatarPreview(me.avatar ? `${API_BASE}/${me.avatar}` : '');
    }
  }, [me]);

  // guardar perfil
  const onSaveProfile = async (e) => {
    e.preventDefault();
    const res = await dispatch(updateProfile(form));
    if (updateProfile.fulfilled.match(res)) {
      setEditMode(false);
      alert('Perfil actualizado ✅');
    } else {
      alert(res.payload || 'Error al actualizar perfil');
    }
  };

  // cambiar contraseña
  const onChangePwd = async (e) => {
    e.preventDefault();
    if (pwd.newPassword.length < 6)
      return alert('La nueva contraseña debe tener al menos 6 caracteres');
    const res = await dispatch(updatePassword(pwd));
    if (updatePassword.fulfilled.match(res)) {
      alert('Contraseña actualizada ✅');
      setPwd({ currentPassword: '', newPassword: '' });
    } else {
      alert(res.payload || 'Error al cambiar contraseña');
    }
  };

  // cambiar avatar
  const onAvatarChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarPreview(URL.createObjectURL(f));
    const res = await dispatch(updateAvatar(f));
    if (!updateAvatar.fulfilled.match(res)) {
      alert(res.payload || 'Error al subir avatar');
      setAvatarPreview(me?.avatar ? `${API_BASE}/${me.avatar}` : '');
    }
  };

  if (isLoading && !me) return <p style={{ padding: 16 }}>Cargando perfil…</p>;
  if (!me) return <p style={{ padding: 16 }}>Inicia sesión para ver tu perfil.</p>;

  return (
    <div className="profile-page">
      <h1>Mi perfil</h1>

      <div className="profile-card">
        {/* Avatar */}
        <div className="avatar-block">
          <img
            className="avatar"
            src={avatarPreview || 'https://i.ibb.co/2kR8Yqr/default-avatar.png'}
            alt="avatar"
          />
          <label className="upload-btn">
            Cambiar foto
            <input type="file" accept="image/*" onChange={onAvatarChange} hidden />
          </label>
        </div>

        {/* Info / Editar */}
        {!editMode ? (
          <div className="info">
            <p>
              <span className="label">Usuario:</span> {me.username}
            </p>
            <p>
              <span className="label">Email:</span> {maskEmail(me.email)}
            </p>
            <p>
              <span className="label">Contraseña:</span> ******
            </p>
            {me.bio && (
              <p>
                <span className="label">Bio:</span> {me.bio}
              </p>
            )}

            {/* Contadores de red */}
            <div className="network">
              <button
                type="button"
                className="pill"
                onClick={() => {
                  setShowFollowers((v) => !v);
                  if (!network?.followers?.length) dispatch(fetchMyNetwork());
                }}
                aria-expanded={showFollowers}
              >
                Seguidores <span className="badge">{network?.followersCount ?? 0}</span>
              </button>

              <button
                type="button"
                className="pill"
                onClick={() => {
                  setShowFollowing((v) => !v);
                  if (!network?.following?.length) dispatch(fetchMyNetwork());
                }}
                aria-expanded={showFollowing}
              >
                Siguiendo <span className="badge">{network?.followingCount ?? 0}</span>
              </button>
            </div>

            <button className="btn edit" onClick={() => setEditMode(true)}>
              Editar perfil
            </button>
          </div>
        ) : (
          <form className="edit-form" onSubmit={onSaveProfile}>
            <label>Usuario</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              minLength={3}
              maxLength={20}
            />

            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <label>Bio (opcional)</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              maxLength={200}
              rows={3}
            />

            <div className="actions">
              <button type="submit" className="btn save">
                Guardar
              </button>
              <button type="button" className="btn cancel" onClick={() => setEditMode(false)}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Listas de red */}
      {showFollowers && (
        <div className="network-list">
          <h2>Seguidores</h2>
          {network?.followers?.length ? (
            <ul className="user-list">
              {network.followers.map((u) => (
                <li key={u._id} className="user-row">
                  <img
                    src={
                      u.avatar ? `${API_BASE}/${u.avatar}` : 'https://i.ibb.co/2kR8Yqr/default-avatar.png'
                    }
                    alt={u.username}
                  />
                  <div className="meta">
                    <strong>@{u.username}</strong>
                  </div>
                  {/* Puedes permitir seguir/seguir quitado desde aquí también */}
                  <FollowButton targetUserId={u._id} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Aún no tienes seguidores.</p>
          )}
        </div>
      )}

      {showFollowing && (
        <div className="network-list">
          <h2>Siguiendo</h2>
          {network?.following?.length ? (
            <ul className="user-list">
              {network.following.map((u) => (
                <li key={u._id} className="user-row">
                  <img
                    src={
                      u.avatar ? `${API_BASE}/${u.avatar}` : 'https://i.ibb.co/2kR8Yqr/default-avatar.png'
                    }
                    alt={u.username}
                  />
                  <div className="meta">
                    <strong>@{u.username}</strong>
                  </div>
                  <FollowButton targetUserId={u._id} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No sigues a nadie todavía.</p>
          )}
        </div>
      )}

      {/* Cambiar contraseña */}
      <div className="password-card">
        <h2>Cambiar contraseña</h2>
        <form onSubmit={onChangePwd} className="pwd-form">
          <label>Contraseña actual</label>
          <input
            type="password"
            value={pwd.currentPassword}
            onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
            required
          />

          <label>Nueva contraseña</label>
          <input
            type="password"
            value={pwd.newPassword}
            onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
            required
            minLength={6}
          />

          <button type="submit" className="btn save">
            Actualizar contraseña
          </button>
        </form>
      </div>

      {/* Posts del usuario */}
      <div className="my-posts">
        <h2>Mis publicaciones</h2>
        {myPosts.length ? (
          <div className="posts-list">
            {myPosts.map((p) => (
              <div key={p._id} className="post-card">
                <Link to={`/post/${p._id}`}>
                  <h3>{p.title || 'Sin título'}</h3>
                </Link>
                <p>{p.content}</p>
                {p.image && (
                  <img
                    src={`${API_BASE}/${p.image}`}
                    width="320"
                    alt=""
                    className="post-img"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No tienes publicaciones aún.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;

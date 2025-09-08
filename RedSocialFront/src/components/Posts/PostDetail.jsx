// src/components/Posts/PostDetail.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getById, updatePost, deletePost, toggleLike } from '../../redux/posts/postsSlice';
import CommentsBox from '../Comments/CommentsBox';
import '../../styles/postDetail.scss';

const API_BASE = 'http://localhost:3000';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { post, isLoading } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  const postUserId = useMemo(() => {
    if (!post) return null;
    return typeof post.user === 'object' ? post.user._id : post.user;
  }, [post]);

  const userId = user?._id || null;

  const isOwner = useMemo(() => {
    if (!postUserId || !userId) return false;
    return String(postUserId) === String(userId);
  }, [postUserId, userId]);

  const hasLiked = useMemo(() => {
    const likes = post?.likes || [];
    if (!userId) return false;
    // likes puede venir como array de strings u ObjectIds
    return likes.some((l) => String(l) === String(userId));
  }, [post, userId]);

  // estado de edición
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (id) dispatch(getById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (post?._id) {
      setTitle(post.title || '');
      setContent(post.content || '');
      setPreview(post.image ? `${API_BASE}/${post.image}` : '');
    }
  }, [post]);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    setImageFile(f || null);
    setPreview(
      f
        ? URL.createObjectURL(f)
        : post?.image
        ? `${API_BASE}/${post.image}`
        : ''
    );
  };

  const onCancel = () => {
    setEditMode(false);
    setTitle(post.title || '');
    setContent(post.content || '');
    setImageFile(null);
    setPreview(post.image ? `${API_BASE}/${post.image}` : '');
  };

  const onSave = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    fd.append('content', content);
    if (imageFile) fd.append('image', imageFile);

    const resAction = await dispatch(updatePost({ id: post._id, formData: fd }));
    if (updatePost.fulfilled.match(resAction)) {
      setEditMode(false);
    } else {
      alert(resAction.payload || 'Error al actualizar el post');
    }
  };

  const onDelete = async () => {
    if (!window.confirm('¿Eliminar este post?')) return;
    const resAction = await dispatch(deletePost(post._id));
    if (deletePost.fulfilled.match(resAction)) {
      navigate('/');
    } else {
      alert(resAction.payload || 'Error al eliminar');
    }
  };

  const onToggleLike = async () => {
    if (!user) return alert('Debes iniciar sesión para dar like');
    await dispatch(toggleLike(post._id));
  };

  if (isLoading && !post?._id) return <p style={{ padding: 16 }}>Cargando…</p>;
  if (!post?._id) return <p style={{ padding: 16 }}>Post no encontrado</p>;

  return (
    <div className="post-detail">
      {!editMode ? (
        <>
          <h1 className="post-title">{post.title || 'Sin título'}</h1>

          {post.image && (
            <img
              className="post-image"
              src={`${API_BASE}/${post.image}`}
              alt={post.title || 'imagen del post'}
            />
          )}

          <p className="post-content">{post.content}</p>

          <div className="post-meta">
            <span>Autor: {typeof post.user === 'object' ? post.user.username : '—'}</span>
            {/* Si no usas comments embebidos, este contador puede ser 0. Lo “real” lo maneja CommentsBox */}
            <span>Comentarios: {post.comments?.length || 0}</span>
          </div>

          <div className="like-row">
            <button className={`like-btn ${hasLiked ? 'liked' : ''}`} onClick={onToggleLike}>
              {hasLiked ? '💖 Quitar like' : '🤍 Dar like'}
            </button>
            <span className="likes-count">{post.likes?.length || 0} likes</span>
          </div>

          {isOwner && (
            <div className="actions">
              <button className="btn edit" onClick={() => setEditMode(true)}>Editar</button>
              <button className="btn delete" onClick={onDelete}>Eliminar</button>
            </div>
          )}
        </>
      ) : (
        <form className="edit-form" onSubmit={onSave}>
          <h2>Editar publicación</h2>

          <label>Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            minLength={3}
            maxLength={100}
            required
          />

          <label>Contenido</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minLength={1}
            maxLength={500}
            required
          />

          <label>Imagen</label>
          {preview && <img className="preview" src={preview} alt="preview" />}
          <input type="file" accept="image/*" onChange={onFileChange} />

          <div className="actions">
            <button type="submit" className="btn save">Guardar</button>
            <button type="button" className="btn cancel" onClick={onCancel}>Cancelar</button>
          </div>
        </form>
      )}

      <CommentsBox
        postId={post._id}
        postOwnerId={typeof post.user === 'object' ? post.user._id : post.user}
      />
    </div>
  );
};

export default PostDetail;

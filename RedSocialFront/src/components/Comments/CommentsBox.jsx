// src/components/Comments/CommentsBox.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getComments, createComment, removeComment } from '../../redux/comments/commentsSlice';
import { getById } from '../../redux/posts/postsSlice'; // 👈 para refrescar contador
import '../../styles/comments.scss';

const formatDate = (iso) => new Date(iso).toLocaleString();

const CommentsBox = ({ postId, postOwnerId }) => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((s) => s.comments);
  const { user } = useSelector((s) => s.auth);

  const [text, setText] = useState('');

  const canDelete = (commentUserId) => {
    if (!user) return false;
    return String(user._id) === String(commentUserId) || String(user._id) === String(postOwnerId);
  };

  useEffect(() => {
    if (postId) dispatch(getComments(postId));
  }, [dispatch, postId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Debes iniciar sesión para comentar');
    if (!text.trim()) return;

    const res = await dispatch(createComment({ postId, content: text.trim() }));
    if (createComment.fulfilled.match(res)) {
      setText('');
      // refrescar detalle para contador de comentarios
      dispatch(getById(postId));
    }
  };

  const onDelete = async (id) => {
    if (!confirm('¿Eliminar este comentario?')) return;
    const res = await dispatch(removeComment(id));
    if (removeComment.fulfilled.match(res)) {
      // refrescar detalle para contador de comentarios
      dispatch(getById(postId));
    }
  };

  return (
    <div className="comments-box">
      <h3>Comentarios</h3>

      {/* Formulario */}
      <form className="comment-form" onSubmit={onSubmit}>
        <textarea
          placeholder="Escribe un comentario…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Comentar</button>
      </form>

      {/* Lista */}
      <div className="comment-list">
        {isLoading && <p>Cargando comentarios…</p>}
        {!isLoading && items.length === 0 && <p>No hay comentarios todavía.</p>}

        {items.map((c) => (
          <div key={c._id} className="comment">
            <img
              className="avatar"
              src={c.user?.avatar || 'https://i.ibb.co/2kR8Yqr/default-avatar.png'}
              alt={c.user?.username || 'usuario'}
            />
            <div className="content">
              <div className="row">
                <span className="author">{c.user?.username || 'Usuario'}</span>
                <span className="meta">{formatDate(c.createdAt)}</span>
                {canDelete(c.user?._id) && (
                  <button className="trash" onClick={() => onDelete(c._id)} title="Eliminar">
                    🗑️
                  </button>
                )}
              </div>
              <p className="text">{c.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsBox;

// src/components/Comments/CommentsBox.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, addComment, deleteComment } from '../../redux/comments/commentsSlice';
import '../../styles/comments.scss';

const CommentsBox = ({ postId }) => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((s) => s.comments);
  const { user } = useSelector((s) => s.auth);

  const [text, setText] = useState('');

  useEffect(() => {
    if (postId) dispatch(fetchComments(postId));
  }, [dispatch, postId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Debes iniciar sesión para comentar');
    if (!text.trim()) return;

    const res = await dispatch(addComment({ postId, content: text.trim() }));
    if (addComment.fulfilled.match(res)) setText('');
    else alert(res.payload || 'Error al comentar');
  };

  const canDelete = (comment) => {
    if (!user) return false;
    const commentUserId = typeof comment.user === 'object' ? comment.user._id : comment.user;
    return commentUserId === user._id;
  };

  return (
    <div className="comments-box">
      <h3>Comentarios</h3>

      {user && (
        <form className="comment-form" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Escribe un comentario…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={300}
          />
          <button type="submit">Comentar</button>
        </form>
      )}

      {isLoading && <p>Cargando comentarios…</p>}

      <ul className="comments-list">
        {items.map((c) => (
          <li key={c._id} className="comment-item">
            <div className="comment-header">
              <strong>{typeof c.user === 'object' ? c.user.username : 'Usuario'}</strong>
              <span className="date">{new Date(c.createdAt).toLocaleString()}</span>
            </div>
            <p className="comment-content">{c.content}</p>
            {canDelete(c) && (
              <button
                className="comment-delete"
                onClick={() => dispatch(deleteComment(c._id))}
                title="Eliminar comentario"
              >
                🗑️
              </button>
            )}
          </li>
        ))}
        {items.length === 0 && !isLoading && <p>No hay comentarios todavía.</p>}
      </ul>
    </div>
  );
};

export default CommentsBox;

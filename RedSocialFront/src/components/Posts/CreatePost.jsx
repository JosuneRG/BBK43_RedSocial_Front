// src/components/Posts/CreatePost.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:3000';

function getToken() {
  const raw = localStorage.getItem('token'); // guardado como string plano
  if (!raw) return null;
  try {
    // por si alguna vez lo guardaste con JSON.stringify
    const maybe = JSON.parse(raw);
    return typeof maybe === 'string' ? maybe : raw;
  } catch {
    return raw;
  }
}

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const navigate = useNavigate();

  const handleFile = (e) => {
    const f = e.target.files?.[0] || null;
    setImage(f);
    setPreview(f ? URL.createObjectURL(f) : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      alert('Debes iniciar sesión para crear publicaciones');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image); // nombre "image" = multer.single('image')

    try {
      await axios.post(`${API_BASE}/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      // limpiar formulario
      setTitle('');
      setContent('');
      setImage(null);
      setPreview('');

      // volver al home: Posts hace getAll en mount → verás el nuevo post
      navigate('/');
    } catch (err) {
      console.error('Error creando post', err?.response?.data || err.message);
      alert(err?.response?.data?.message || 'Error al crear post');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post-form" style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
      <h2>Crear publicación</h2>

      <input
        type="text"
        placeholder="Título (opcional)"
        value={title}
        onChange={e => setTitle(e.target.value)}
        maxLength={100}
      />

      <textarea
        placeholder="Contenido"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
        minLength={1}
        maxLength={500}
        rows={5}
      />

      {preview && (
        <img src={preview} alt="preview" style={{ maxWidth: 320, borderRadius: 8 }} />
      )}
      <input type="file" accept="image/*" onChange={handleFile} />

      <button type="submit">Crear Post</button>
    </form>
  );
};

export default CreatePost;

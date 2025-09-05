// src/components/Posts/CreatePost.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rawToken = localStorage.getItem('token');
    const token = rawToken ? JSON.parse(rawToken) : null; // 👈 importante

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:3000/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      // limpiar y navegar
      setTitle('');
      setContent('');
      setImage(null);
      navigate('/'); // volver al home para ver el nuevo post
    } catch (err) {
      console.error('Error creando post', err?.response?.data || err.message);
      alert(err?.response?.data?.message || 'Error al crear post');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post-form">
      <h2>Crear publicación</h2>
      <input
        type="text"
        placeholder="Título (opcional)"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Contenido"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={e => setImage(e.target.files[0])}
      />
      <button type="submit">Crear Post</button>
    </form>
  );
};

export default CreatePost;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../redux/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, message, user } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (isSuccess && user) {
      navigate('/');
    }
    return () => { dispatch(reset()); };
  }, [isSuccess, user, navigate, dispatch]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login(form));
    if (login.rejected.match(res)) {
      // error manejado en slice
    }
  };

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (isError) dispatch(reset());
  };

  return (
    <div style={{
      maxWidth: 420,
      margin: '40px auto',
      padding: 32,
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 6px 18px rgba(0,0,0,.06)',
      textAlign: 'center' // 🔹 Centra todo el contenido del card
    }}>
      {/* Títulos */}
      <h1 style={{ margin: 0, marginBottom: 8, color: '#111', fontSize: '1.8rem' }}>
        Inicia sesión
      </h1>
      <p style={{ marginTop: 0, marginBottom: 24, color: '#444', fontSize: '1rem' }}>
        Accede con tu cuenta
      </p>

      {/* Error */}
      {isError && (
        <div style={{
          background: '#ffe6e6',
          border: '1px solid #ffb3b3',
          color: '#b00020',
          padding: '10px 12px',
          borderRadius: 8,
          marginBottom: 16,
          fontWeight: 600,
          textAlign: 'left'
        }}>
          {message || 'Credenciales inválidas'}
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14, textAlign: 'left' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="email" style={{ fontWeight: 600, color: '#333', marginBottom: 4 }}>
            Email*
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
            style={{ padding: '.6rem .8rem', border: '1px solid #ddd', borderRadius: 8 }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="password" style={{ fontWeight: 600, color: '#333', marginBottom: 4 }}>
            Contraseña*
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
            style={{ padding: '.6rem .8rem', border: '1px solid #ddd', borderRadius: 8 }}
          />
        </div>

        {/* Enlace contraseña */}
        <div style={{ marginTop: 16 }}>
          <p className="forgot">
            <a href="/forgot-password" style={{ color: '#0a66ff', fontWeight: 500, fontSize: '.95rem' }}>¿Has olvidado la contraseña?</a>
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            marginTop: 10,
            padding: '.7rem 1rem',
            border: 'none',
            borderRadius: 8,
            background: isLoading ? '#7da8ff' : '#0a66ff',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          
          {isLoading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      
    </div>
  );
};

export default Login;

// src/pages/Register.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../redux/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import '../styles/Register.scss';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const { firstName, username, email, password, password2 } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSuccess, isError, isLoading, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess) {
      notification.success({
        message: 'Éxito',
        description: message || 'Usuario registrado correctamente',
      });
      // decide: o vas a login o auto-login (según tu back). De momento vamos a /login:
      navigate('/login');
    }

    if (isError) {
      notification.error({
        message: 'Error',
        description: message || 'Algo salió mal',
      });
    }

    return () => dispatch(reset());
  }, [isSuccess, isError, message, dispatch, navigate]);

  const onChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      return notification.error({ message: 'Campos requeridos', description: 'Usuario, email y contraseña son obligatorios.' });
    }

    if (password !== password2) {
      return notification.error({ message: 'Error', description: 'Las contraseñas no coinciden' });
    }

    // El backend solo usa username, email, password. firstName no hace falta (no pasa nada si lo envías)
    dispatch(register({ username, email, password }));
  };

  return (
    <div className="form-container">
      <form onSubmit={onSubmit} noValidate>
        <h2>Registro</h2>

        <input
          type="text"
          name="firstName"
          placeholder="Nombre"
          value={firstName}
          onChange={onChange}
          autoComplete="given-name"
        />

        <input
          type="text"
          name="username"
          placeholder="Usuario"
          value={username}
          onChange={onChange}
          required
          autoComplete="username"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={onChange}
          required
          autoComplete="email"
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={password}
          onChange={onChange}
          required
          minLength={6}
          autoComplete="new-password"
        />

        <input
          type="password"
          name="password2"
          placeholder="Confirmar contraseña"
          value={password2}
          onChange={onChange}
          required
          minLength={6}
          autoComplete="new-password"
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registrando…' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
};

export default Register;

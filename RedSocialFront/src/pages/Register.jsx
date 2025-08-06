import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../redux/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import '../styles/Register.scss'; // ⬅️ Añadido

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
  const { isSuccess, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess) {
      notification.success({
        message: 'Éxito',
        description: message || 'Usuario registrado correctamente',
      });
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

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      return notification.error({
        message: 'Error',
        description: 'Las contraseñas no coinciden',
      });
    }
    dispatch(register(formData));
  };

  return (
    <div className="form-container">
      <form onSubmit={onSubmit}>
        <h2>Registro</h2>
        <input type="text" name="firstName" placeholder="Nombre" value={firstName} onChange={onChange} required />
        <input type="text" name="username" placeholder="Usuario" value={username} onChange={onChange} required />
        <input type="email" name="email" placeholder="Email" value={email} onChange={onChange} required />
        <input type="password" name="password" placeholder="Contraseña" value={password} onChange={onChange} required />
        <input type="password" name="password2" placeholder="Confirmar contraseña" value={password2} onChange={onChange} required />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;

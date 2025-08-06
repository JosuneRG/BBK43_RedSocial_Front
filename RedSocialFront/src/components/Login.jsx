import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { login, reset } from '../redux/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { notification } from 'antd';
import '../styles/Register.scss'; // reutilizamos el mismo estilo

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      notification.error({ message: 'Error', description: message });
    }

    if (isSuccess) {
      notification.success({ message: 'Success', description: message });
      setTimeout(() => navigate('/profile'), 1500);
    }

    return () => dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) =>
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="form-container">
      <form onSubmit={onSubmit}>
        <h2>Login</h2>
        <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
        <input type="password" name="password" value={password} onChange={onChange} placeholder="Contraseña" required />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;

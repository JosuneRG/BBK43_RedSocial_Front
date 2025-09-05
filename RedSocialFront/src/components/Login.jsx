import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { login, reset } from '../redux/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { notification } from 'antd';
import '../styles/Register.scss'; // reutilizamos el mismo estilo

const Login = () => {

  const [formData, setFormData] = useState({
     email: '', 
     password: '' 
  });

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

  const handleChnge = (e) =>
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('login...',formData);
    dispatch(login(formData));
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input type="email" name="email" value={email} onChange={handleChnge} placeholder="Email" required />
        <input type="password" name="password" value={password} onChange={handleChnge} placeholder="Contraseña" required />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;

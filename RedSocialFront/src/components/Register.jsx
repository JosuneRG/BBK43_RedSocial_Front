import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../../redux/auth/authSlice';
import { notification } from 'antd'

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

  const { isSuccess, isError, message } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isSuccess) 
    {
      notification.success({
        message: 'Success',
        description: message,
      })
    
      navigate('/login')
    }

    if (isError) 
    {
      notification.error({ message: 'Error', description:
      message })
    }

    dispatch(reset())
    
  }, [isSuccess, isError, message]);


  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault()

    if (password !== password2)
    {
      return notification.error({
      message: 'Error',
      description: 'Passwords does not match',
      })
    } 
    else 
    {
      notification.success({
        message: 'Success',
        description: 'User registered!',
      })
      
      return dispatch(register(formData))
    }
  }


  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="firstName" placeholder="Nombre" value={firstName} onChange={onChange} required />
      <input type="text" name="username" placeholder="Usuario" value={username} onChange={onChange} required />
      <input type="email" name="email" placeholder="Email" value={email} onChange={onChange} required />
      <input type="password" name="password" placeholder="Contraseña" value={password} onChange={onChange} required />
      <input type="password" name="password2" placeholder="Confirmar contraseña" value={password2} onChange={onChange} required />
      <button type="submit">Registrarse</button>
    </form>
  );
};

export default Register;

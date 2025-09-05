// src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './../redux/auth/authSlice';
import logo from '../assets/logo6.png'; // 👈 importa el logo desde src/assets
import '../styles/Header.scss';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link className="logo" to="/">
          <img src={logo} alt="Logo Foro" className="logo-img" />
          <span className="logo-text">ForoIdeas</span>
        </Link>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            {/* Ruta protegida que montamos en App.jsx con PrivateRoute */}
            <Link to="/add" className="create-btn">➕ Crear</Link>
            <Link to="/profile" className="user-link">👤 {user.username}</Link>
            <button className="logout-btn" onClick={onLogout}>Salir</button>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-link">Login</Link>
            <Link to="/register" className="auth-link">Registro</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;

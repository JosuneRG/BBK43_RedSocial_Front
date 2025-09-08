import React, { useState } from 'react';  
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './../redux/auth/authSlice';
import logo from '../assets/logo6.png';
import '../styles/Header.scss';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [query, setQuery] = useState('');

  const goSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}&type=posts`);
    setQuery('');
  };

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

        {/* mini buscador */}
        <form onSubmit={goSearch} style={{ display: 'flex', gap: 6, marginLeft: 12 }}>
          <input
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar posts o usuarios…"
          />
        </form>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <Link to="/add" className="create-btn">➕ Crear Post</Link>
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

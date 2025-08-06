import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './../redux/auth/authSlice';
import { useState } from 'react';
import '../styles/Header.scss'; 
import { FiLogIn, FiUserPlus } from 'react-icons/fi';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [text, setText] = useState('');

  const handleKeyUp = (e) => {
    if (e.key === 'Enter' && text.trim() !== '') {
      navigate(`/search/${text}`);
      setText('');
    }
  };

  const onLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link className="logo" to="/">RedSocial</Link>
        <input
          className="search-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyUp={handleKeyUp}
          placeholder="Buscar post..."
        />
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <Link to="/profile" className="user-link">👤 {user.username}</Link>
            <button className="logout-btn" onClick={onLogout}>Salir</button>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-link">
              <FiLogIn size={18} style={{ marginRight: '6px' }} /> Login
            </Link>
            <Link to="/register" className="auth-link">
              <FiUserPlus size={18} style={{ marginRight: '6px' }} /> Registro
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;

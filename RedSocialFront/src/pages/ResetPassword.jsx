import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doResetPassword } from '../redux/users/usersService';
import '../styles/auth.scss';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (pwd.length < 6) return alert('La contraseña debe tener al menos 6 caracteres');
    setLoading(true);
    try {
      const data = await doResetPassword({ token, newPassword: pwd });
      alert(data.message || 'Contraseña actualizada');
      navigate('/login');
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Establecer nueva contraseña</h1>
        <form onSubmit={onSubmit} className="auth-form">
          <label>Nueva contraseña</label>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            minLength={6}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Actualizando…' : 'Guardar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

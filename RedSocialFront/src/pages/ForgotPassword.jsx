import React, { useState } from 'react';
import { requestPasswordReset } from '../redux/users/usersService';
import '../styles/auth.scss';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const data = await requestPasswordReset(email.trim());
      setResult(data);
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Recuperar contraseña</h1>
        <p className="muted">
          Escribe tu email y generaremos un enlace de reseteo (demo: lo verás aquí mismo).
        </p>

        <form onSubmit={onSubmit} className="auth-form">
          <label>Email</label>
          <input
            type="email"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Generando…' : 'Enviar enlace'}
          </button>
        </form>

        {result && (
          <div className="hint">
            <p><strong>{result.message}</strong></p>
            {result.resetLink && (
              <p>
                Enlace de reseteo (demo): <a href={result.resetLink}>{result.resetLink}</a>
              </p>
            )}
            {result.expiresAt && (
              <p className="muted">
                Expira: {new Date(result.expiresAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

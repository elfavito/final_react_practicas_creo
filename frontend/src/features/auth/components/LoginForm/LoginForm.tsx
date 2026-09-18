import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../../../store/store';
import { setCredentials } from '../../slice/authSlice';
import { Input } from '../../../../components/ui/Input/Input';
import { Button } from '../../../../components/ui/Button/Button';
import { Card } from '../../../../components/ui/Card/Card';
import axiosInstance from '../../../../lib/axiosInstance';
import styles from './LoginForm.module.css';

export const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // After login, redirect back to the originally requested page (e.g. /checkout)
  const from = (location.state as any)?.from?.pathname || '/products';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // FastAPI OAuth2 expects form-encoded body
      const formData = new URLSearchParams();
      formData.append('username', email.trim().toLowerCase());
      formData.append('password', password);

      const response = await axiosInstance.post('/auth/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { access_token, user } = response.data;
      dispatch(setCredentials({ token: access_token, user }));
      navigate(from, { replace: true });
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(detail || 'Credenciales inválidas. Verifica tu email y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Content>
        <h2 className={styles.title}>Bienvenido de nuevo</h2>
        <p className={styles.subtitle}>Ingresa a tu cuenta para continuar</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            id="login-email"
            label="Usuario o Correo Electrónico"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="favo o alumno@educart.com"
            required
          />
          <Input
            id="login-password"
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            error={error}
          />
          <Button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
            fullWidth
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </Button>
        </form>
      </Card.Content>
      <Card.Footer>
        <p style={{ textAlign: 'center', fontSize: '0.875rem', margin: 0 }}>
          ¿No tienes una cuenta? <Link to="/register" className={styles.link}>Regístrate aquí</Link>
        </p>
      </Card.Footer>
    </Card>
  );
};

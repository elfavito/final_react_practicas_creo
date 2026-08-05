import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../../../../store/store';
import { Input } from '../../../../components/ui/Input/Input';
import { Button } from '../../../../components/ui/Button/Button';
import { Card } from '../../../../components/ui/Card/Card';
import styles from './LoginForm.module.css';

export const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call for now (auth logic would go here)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (email === 'test@test.com' && password === 'password') {
        // Here you would dispatch login success action
        navigate('/products');
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
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
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            required
          />
          <Input
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

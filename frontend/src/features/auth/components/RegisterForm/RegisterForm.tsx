import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../../../components/ui/Input/Input';
import { Button } from '../../../../components/ui/Button/Button';
import { Card } from '../../../../components/ui/Card/Card';
import styles from './RegisterForm.module.css';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Dispatch register success
      navigate('/products');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Content>
        <h2 className={styles.title}>Crear una cuenta</h2>
        <p className={styles.subtitle}>Únete a nosotros para empezar a comprar</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Nombre Completo"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Juan Pérez"
            required
          />
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
            {loading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </form>
      </Card.Content>
      <Card.Footer>
        <p style={{ textAlign: 'center', fontSize: '0.875rem', margin: 0 }}>
          ¿Ya tienes una cuenta? <Link to="/login" className={styles.link}>Inicia sesión</Link>
        </p>
      </Card.Footer>
    </Card>
  );
};

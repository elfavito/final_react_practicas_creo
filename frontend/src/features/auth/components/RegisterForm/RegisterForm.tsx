import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../../../../store/store';
import { setCredentials } from '../../slice/authSlice';
import { Input } from '../../../../components/ui/Input/Input';
import { Button } from '../../../../components/ui/Button/Button';
import { Card } from '../../../../components/ui/Card/Card';
import axiosInstance from '../../../../lib/axiosInstance';
import styles from './RegisterForm.module.css';

export const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();
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
      // 1. Registrar al usuario en el backend real
      await axiosInstance.post('/auth/register', {
        email: email.trim().toLowerCase(),
        password,
        full_name: name.trim(),
      });

      // 2. Iniciar sesión automáticamente para obtener el token JWT
      const formData = new URLSearchParams();
      formData.append('username', email.trim().toLowerCase());
      formData.append('password', password);

      const loginResponse = await axiosInstance.post('/auth/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { access_token, user } = loginResponse.data;
      dispatch(setCredentials({ token: access_token, user }));

      // 3. Redirigir al catálogo de productos con la sesión activa
      navigate('/products');
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(
        typeof detail === 'string'
          ? detail
          : 'Error al registrar la cuenta. Por favor verifica los datos.'
      );
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

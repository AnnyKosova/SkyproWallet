import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import './LoginPage.css';
import { Header } from '@/shared/ui/header';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Редирект если уже авторизован
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/expenses');
    }
  }, [isAuthenticated, navigate]);

  // Очищаем ошибки при изменении полей
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Очищаем ошибку для конкретного поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.email, formData.password);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className={`login-page ${error ? 'error' : ''}`}>
      <Header />

      <div className="login-container">
        <div className={`login-form-container ${error ? 'error' : ''}`}>
          <h1 className="login-title">Вход</h1>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Эл. почта"
                disabled={isLoading}
              />
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>

            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Пароль"
                disabled={isLoading}
              />
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
              {error && !errors.password && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`login-button ${isLoading ? 'disabled' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="register-link">
            <p>
              Нужно зарегистрироваться?
              <br />
              <Link to="/register" className="register-link-text">
                Регистрируйтесь здесь
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

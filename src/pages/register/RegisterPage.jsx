import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import { Header } from '@/shared/ui/header';
import './RegisterPage.css';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const { register, isAuthenticated, isLoading, error, clearError } = useAuth();
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

    if (!formData.name) {
      newErrors.name = 'Введите имя';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
    }

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
      await register(formData.name, formData.email, formData.password);
    } catch (err) {
      console.error('Register error:', err);
    }
  };

  return (
    <div className={`register-page ${error ? 'error' : ''}`}>
      <Header />

      <div className="register-container">
        <div className={`register-form-container ${error ? 'error' : ''}`}>
          <h1 className="register-title">Регистрация</h1>

          <form className="register-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Имя"
                disabled={isLoading}
              />
              {errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
            </div>

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
              className={`register-button ${isLoading ? 'disabled' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="login-link">
            <p>
              Уже есть аккаунт?
              <br />
              <Link to="/login" className="login-link-text">
                Войдите здесь
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

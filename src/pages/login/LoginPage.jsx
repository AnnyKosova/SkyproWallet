import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import './LoginPage.css';
import { Header } from '@/shared/ui/header 2';

export const LoginPage = () => {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('loginFormData');
    return saved ? JSON.parse(saved) : { email: '', password: '' };
  });
  const [errors, setErrors] = useState({});
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const { login, isAuthenticated, isLoading, error, clearError, isFormSubmitted, setFormSubmitted } = useAuth();
  const navigate = useNavigate();

  // Сохраняем данные формы в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('loginFormData', JSON.stringify(formData));
  }, [formData]);

  // Редирект если уже авторизован
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/expenses');
      localStorage.removeItem('loginFormData');
    }
  }, [isAuthenticated, navigate]);

  // Сбрасываем isFormSubmitted только при успешном входе
  useEffect(() => {
    if (isAuthenticated) {
      setFormSubmitted(false);
    }
  }, [isAuthenticated, setFormSubmitted]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    clearError();
    
    if (isFormSubmitted) {
      validateForm();
    }
  }, [isFormSubmitted, clearError]);

  const validateForm = useCallback(() => {
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
    const hasErrors = Object.keys(newErrors).length > 0;
    setHasValidationErrors(hasErrors);
    return !hasErrors;
  }, [formData.email, formData.password]);

  // Обработчик клика по кнопке
  const handleButtonClick = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFormSubmitted(true);
    
    const isValid = validateForm();
    
    if (!isValid) {
      return;
    }

    const success = await login(formData.email, formData.password);
    
    if (success) {
      navigate('/expenses');
    }
  }, [formData.email, formData.password, validateForm, login, navigate, setFormSubmitted]);

  // Показываем ошибки только после попытки отправки
  const shouldShowError = useCallback((fieldName) => {
    return isFormSubmitted && errors[fieldName];
  }, [isFormSubmitted, errors]);

  const shouldShowGlobalError = useCallback(() => {
    return error || (isFormSubmitted && hasValidationErrors);
  }, [error, isFormSubmitted, hasValidationErrors]);

  // Показываем ошибки полей при наличии ошибки от API или валидации
  const shouldShowFieldError = useCallback((fieldName) => {
    if (fieldName === 'password') {
      return (isFormSubmitted && errors[fieldName]) || (error && isFormSubmitted);
    }
    return isFormSubmitted && errors[fieldName];
  }, [isFormSubmitted, errors, error]);

  // Определяем, должна ли кнопка быть неактивной
  const isButtonDisabled = useCallback(() => {
    const hasValidationErrorsResult = isFormSubmitted && hasValidationErrors;
    const hasApiError = error && isFormSubmitted;
    const isLoadingResult = isLoading;
    
    return hasValidationErrorsResult || isLoadingResult || hasApiError;
  }, [isFormSubmitted, hasValidationErrors, isLoading, error]);

  return (
    <div className={`login-page ${error || (isFormSubmitted && hasValidationErrors) ? 'error' : ''}`}>
      <Header />

      <div className="login-container">
        <div className={`login-form-container ${error || (isFormSubmitted && hasValidationErrors) ? 'error' : ''}`}>
          <h1 className="login-title">Вход</h1>

          <div className="login-form">
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${shouldShowFieldError('email') ? 'error' : ''}`}
                  placeholder="Эл. почта"
                  disabled={isLoading}
                />
                {shouldShowFieldError('email') && (
                  <span className="error-star">
                    {formData.email ? ' *' : '*'}
                  </span>
                )}
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${shouldShowFieldError('password') ? 'error' : ''}`}
                  placeholder="Пароль"
                  disabled={isLoading}
                />
                {shouldShowFieldError('password') && (
                  <span className="error-star">
                    {formData.password ? ' *' : '*'}
                  </span>
                )}
              </div>
              {shouldShowGlobalError() && (
                <div className="error-message">
                  Упс! Введенные вами данные некорректны. Введите данные корректно и повторите попытку.
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleButtonClick}
              className={`login-button ${isButtonDisabled() ? 'disabled' : ''}`}
              disabled={isButtonDisabled()}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </div>

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

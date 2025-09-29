import { useAuth } from '@/shared/context/AuthContext';
import { Header } from '@/shared/ui/header 2';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [localFormSubmitted, setLocalFormSubmitted] = useState(false);
  const {
    register,
    isAuthenticated,
    isLoading,
    error,
    clearError,
    isFormSubmitted,
    setFormSubmitted,
  } = useAuth();
  const navigate = useNavigate();

  // Редирект если уже авторизован
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/expenses');
    }
  }, [isAuthenticated, navigate]);

  // Сбрасываем isFormSubmitted только при успешной регистрации
  useEffect(() => {
    if (isAuthenticated) {
      setFormSubmitted(false);
      setLocalFormSubmitted(false);
    }
  }, [isAuthenticated, setFormSubmitted]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      clearError();

      if (localFormSubmitted) {
        validateForm();
      }
    },
    [localFormSubmitted, clearError]
  );

  const validateForm = useCallback(() => {
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
    const hasErrors = Object.keys(newErrors).length > 0;
    setHasValidationErrors(hasErrors);
    return !hasErrors;
  }, [formData.name, formData.email, formData.password]);

  // Обработчик клика по кнопке
  const handleButtonClick = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      setFormSubmitted(true);
      setLocalFormSubmitted(true);

      const isValid = validateForm();

      if (!isValid) {
        return;
      }

      const success = await register(
        formData.name,
        formData.email,
        formData.password
      );

      if (success) {
        navigate('/expenses');
      }
    },
    [
      formData.name,
      formData.email,
      formData.password,
      validateForm,
      register,
      navigate,
      setFormSubmitted,
    ]
  );

  // Показываем ошибки только после попытки отправки
  const shouldShowError = useCallback(
    (fieldName) => {
      return localFormSubmitted && errors[fieldName];
    },
    [localFormSubmitted, errors]
  );

  const shouldShowGlobalError = useCallback(() => {
    return error || (localFormSubmitted && hasValidationErrors);
  }, [error, localFormSubmitted, hasValidationErrors]);

  // Показываем ошибки полей при наличии ошибки от API или валидации
  const shouldShowFieldError = useCallback(
    (fieldName) => {
      if (fieldName === 'password') {
        return (
          (localFormSubmitted && errors[fieldName]) ||
          (error && localFormSubmitted)
        );
      }
      if (fieldName === 'email') {
        return (
          (localFormSubmitted && errors[fieldName]) || error // Подсвечиваем email при ошибке API
        );
      }
      return localFormSubmitted && errors[fieldName];
    },
    [localFormSubmitted, errors, error]
  );

  // Определяем, должна ли кнопка быть неактивной
  const isButtonDisabled = useCallback(() => {
    const hasValidationErrorsResult = localFormSubmitted && hasValidationErrors;
    const hasApiError = error && localFormSubmitted;
    const isLoadingResult = isLoading;

    return hasValidationErrorsResult || isLoadingResult || hasApiError || error; // Добавляем error для блокировки кнопки при ошибке API
  }, [localFormSubmitted, hasValidationErrors, isLoading, error]);

  return (
    <div
      className={`register-page ${error || (localFormSubmitted && hasValidationErrors) ? 'error' : ''}`}
    >
      <Header />

      <div className="register-container">
        <div
          className={`register-form-container ${error || (localFormSubmitted && hasValidationErrors) ? 'error' : ''}`}
        >
          <h1 className="register-title">Регистрация</h1>

          <div className="register-form">
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${shouldShowFieldError('name') ? 'error' : ''}`}
                  placeholder="Имя"
                  disabled={isLoading}
                />
                {shouldShowFieldError('name') && (
                  <span className="error-star">
                    {formData.name ? ' *' : '*'}
                  </span>
                )}
              </div>
            </div>

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
                  {error ||
                    'Упс! Введенные вами данные некорректны. Введите данные корректно и повторите попытку.'}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleButtonClick}
              className={`register-button ${isButtonDisabled() ? 'disabled' : ''}`}
              disabled={isButtonDisabled()}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </div>

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

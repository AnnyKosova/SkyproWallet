import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validateLoginForm } from '@/shared/utils/validation';
import { useAuth } from '@/shared/context/auth-ctx/AuthContext';
import { Header } from '@/shared/ui/header';
import './LoginPage.css';

export const LoginPage = () => {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('loginFormData');
    return saved ? JSON.parse(saved) : { email: '', password: '' };
  });
  const [errors, setErrors] = useState({});
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const {
    login,
    isAuthenticated,
    isLoading,
    error,
    clearError,
    isFormSubmitted,
    setFormSubmitted,
  } = useAuth();
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

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      clearError();

      if (isFormSubmitted) {
        validateForm();
      }
    },
    [isFormSubmitted, clearError]
  );

  const validateForm = useCallback(() => {
    const { errors: newErrors, hasErrors } = validateLoginForm(formData);
    setErrors(newErrors);
    setHasValidationErrors(hasErrors);
    return !hasErrors;
  }, [formData]);

  // Обработчик клика по кнопке
  const handleButtonClick = useCallback(
    async (e) => {
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
    },
    [
      formData.email,
      formData.password,
      validateForm,
      login,
      navigate,
      setFormSubmitted,
    ]
  );

  // Ошибка eslint: shouldShowError - не используется
  // Показываем ошибки только после попытки отправки
  // const shouldShowError = useCallback(
  //   (fieldName) => {
  //     return isFormSubmitted && errors[fieldName];
  //   },
  //   [isFormSubmitted, errors]
  // );

  const shouldShowGlobalError = useCallback(() => {
    return error || (isFormSubmitted && hasValidationErrors);
  }, [error, isFormSubmitted, hasValidationErrors]);

  // Показываем ошибки полей при наличии ошибки от API или валидации
  const shouldShowFieldError = useCallback(
    (fieldName) => {
      if (fieldName === 'password') {
        return (
          (isFormSubmitted && errors[fieldName]) || (error && isFormSubmitted)
        );
      }
      return isFormSubmitted && errors[fieldName];
    },
    [isFormSubmitted, errors, error]
  );

  // Определяем, должна ли кнопка быть неактивной
  const isButtonDisabled = useCallback(() => {
    const hasValidationErrorsResult = isFormSubmitted && hasValidationErrors;
    const hasApiError = error && isFormSubmitted;
    const isLoadingResult = isLoading;

    return hasValidationErrorsResult || isLoadingResult || hasApiError;
  }, [isFormSubmitted, hasValidationErrors, isLoading, error]);

  return (
    <div
      className={`login-page ${error || (isFormSubmitted && hasValidationErrors) ? 'error' : ''}`}
    >
      <Header />

      <div className="login-container">
        <div
          className={`login-form-container ${error || (isFormSubmitted && hasValidationErrors) ? 'error' : ''}`}
        >
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
                  className={`form-input ${shouldShowFieldError('email', isFormSubmitted, errors, error) ? 'error' : ''}`}
                  placeholder="Эл. почта"
                  disabled={isLoading}
                />
                {shouldShowFieldError('email', isFormSubmitted, errors, error) && (
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
                  className={`form-input ${shouldShowFieldError('password', isFormSubmitted, errors, error) ? 'error' : ''}`}
                  placeholder="Пароль"
                  disabled={isLoading}
                />
                {shouldShowFieldError('password', isFormSubmitted, errors, error) && (
                  <span className="error-star">
                    {formData.password ? ' *' : '*'}
                  </span>
                )}
              </div>
              {shouldShowGlobalError(error, isFormSubmitted, hasValidationErrors) && (
                <div className="error-message">
                  Упс! Введенные вами данные некорректны. Введите данные
                  корректно и повторите попытку.
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleButtonClick}
              className={`login-button ${isButtonDisabled(isFormSubmitted, hasValidationErrors, isLoading, error) ? 'disabled' : ''}`}
              disabled={isButtonDisabled(isFormSubmitted, hasValidationErrors, isLoading, error)}
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

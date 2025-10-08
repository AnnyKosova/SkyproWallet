import { useAuth } from '@/shared/context/auth-ctx/AuthContext';
import { Header } from '@/shared/ui/header';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validateRegisterForm } from '@/shared/utils/validation';
import { shouldShowFieldError, shouldShowGlobalError, isButtonDisabled } from '@/shared/utils/formHelpers';
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
    const { errors: newErrors, hasErrors } = validateRegisterForm(formData);
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
                  className={`form-input ${shouldShowFieldError('name', localFormSubmitted, errors, error) ? 'error' : ''}`}
                  placeholder="Имя"
                  disabled={isLoading}
                />
                {shouldShowFieldError('name', localFormSubmitted, errors, error) && (
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
                  className={`form-input ${shouldShowFieldError('email', localFormSubmitted, errors, error) ? 'error' : ''}`}
                  placeholder="Эл. почта"
                  disabled={isLoading}
                />
                {shouldShowFieldError('email', localFormSubmitted, errors, error) && (
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
                  className={`form-input ${shouldShowFieldError('password', localFormSubmitted, errors, error) ? 'error' : ''}`}
                  placeholder="Пароль"
                  disabled={isLoading}
                />
                {shouldShowFieldError('password', localFormSubmitted, errors, error) && (
                  <span className="error-star">
                    {formData.password ? ' *' : '*'}
                  </span>
                )}
              </div>
              {shouldShowGlobalError(error, localFormSubmitted, hasValidationErrors) && (
                <div className="error-message">
                  {error ||
                    'Упс! Введенные вами данные некорректны. Введите данные корректно и повторите попытку.'}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleButtonClick}
              className={`register-button ${isButtonDisabled(localFormSubmitted, hasValidationErrors, isLoading, error) ? 'disabled' : ''}`}
              disabled={isButtonDisabled(localFormSubmitted, hasValidationErrors, isLoading, error)}
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

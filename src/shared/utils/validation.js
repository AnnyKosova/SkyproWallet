// Утилиты для валидации форм

// Валидация email
export const validateEmail = (email) => {
  if (!email) {
    return 'Введите email';
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return 'Введите корректный email';
  }
  return null;
};

// Валидация пароля
export const validatePassword = (password) => {
  if (!password) {
    return 'Введите пароль';
  }
  if (password.length < 6) {
    return 'Пароль должен содержать минимум 6 символов';
  }
  return null;
};

// Валидация имени
export const validateName = (name) => {
  if (!name) {
    return 'Введите имя';
  }
  if (name.length < 2) {
    return 'Имя должно содержать минимум 2 символа';
  }
  return null;
};

// Валидация формы входа
export const validateLoginForm = (formData) => {
  const errors = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  return {
    errors,
    hasErrors: Object.keys(errors).length > 0
  };
};

// Валидация формы регистрации
export const validateRegisterForm = (formData) => {
  const errors = {};
  
  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  return {
    errors,
    hasErrors: Object.keys(errors).length > 0
  };
};

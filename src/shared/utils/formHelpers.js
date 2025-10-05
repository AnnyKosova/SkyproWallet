// Утилиты для работы с формами

// Проверка, нужно ли показывать ошибку поля
export const shouldShowFieldError = (fieldName, formSubmitted, errors, apiError) => {
  // Для пароля показываем ошибку при валидации или API ошибке
  if (fieldName === 'password') {
    return (formSubmitted && errors[fieldName]) || (apiError && formSubmitted);
  }
  
  // Для email показываем ошибку при валидации или API ошибке
  if (fieldName === 'email') {
    return (formSubmitted && errors[fieldName]) || apiError;
  }
  
  // Для остальных полей только при валидации
  return formSubmitted && errors[fieldName];
};

// Проверка, нужно ли показывать глобальную ошибку
export const shouldShowGlobalError = (apiError, formSubmitted, hasValidationErrors) => {
  return apiError || (formSubmitted && hasValidationErrors);
};

// Проверка, должна ли кнопка быть неактивной
export const isButtonDisabled = (formSubmitted, hasValidationErrors, isLoading, apiError) => {
  const hasValidationErrorsResult = formSubmitted && hasValidationErrors;
  const hasApiError = apiError && formSubmitted;
  
  return hasValidationErrorsResult || isLoading || hasApiError || apiError;
};

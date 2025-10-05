import { authAPI } from '@/shared/api/auth';
import { createContext, useContext, useEffect, useReducer } from 'react';

// Начальное состояние
const initialState = {
  // DEBUG: localStorage token = localStorage.getItem('token');
  // DEBUG: isAuthenticated will be = !!localStorage.getItem('token');
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'), // ✅ Исправлено! // DEBUG: localStorage token = '${localStorage.getItem('token')}'
  isLoading: false,
  error: null,
  isFormSubmitted: localStorage.getItem('isFormSubmitted') === 'true' || false,
};

// Типы действий
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_FORM_SUBMITTED: 'SET_FORM_SUBMITTED',
};

// Редьюсер для управления состоянием
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
        isFormSubmitted: true,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
        isFormSubmitted: false,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
        isFormSubmitted: true,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
        isFormSubmitted: false,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.SET_FORM_SUBMITTED:
      return {
        ...state,
        isFormSubmitted: action.payload,
      };

    default:
      return state;
  }
};

// Создаем контекст
const AuthContext = createContext();

// Провайдер контекста
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Сохраняем isFormSubmitted в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('isFormSubmitted', state.isFormSubmitted.toString());
  }, [state.isFormSubmitted]);

  // Проверяем токен при загрузке приложения
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START }); // ✅ Добавляем состояние загрузки
      authAPI
        .verifyToken(token)
        .then((user) => {
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user, token },
          });
        })

        .catch(() => {
        .catch((error) => {
          // console.log("DEBUG: Token verification failed:", error);№
          localStorage.removeItem('token');
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        });
    }
  }, []);

  // Сохраняем токен в localStorage при изменении
  useEffect(() => {
    if (state.token) {
      localStorage.setItem('token', state.token);
    } else {
      localStorage.removeItem('token');
    }
  }, [state.token]);

  // Функция для обработки успешной аутентификации
  const handleAuthSuccess = (user, token) => {
    dispatch({
      type: AUTH_ACTIONS.LOGIN_SUCCESS,
      payload: { user, token },
    });
  };

  // Функция для обработки ошибки аутентификации
  const handleAuthError = (error) => {
    dispatch({
      type: AUTH_ACTIONS.LOGIN_FAILURE,
      payload: error,
    });
  };

  // Функции для работы с авторизацией
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    const result = await authAPI.login(email, password);

    if (result.error) {
      handleAuthError(result.error);
      return false;
    } else {
      handleAuthSuccess(result.user, result.token);
      return true;
    }
  };

  const register = async (name, email, password) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });

    const result = await authAPI.register(name, email, password);

    if (result.error) {
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: result.error,
      });
      return false;
    } else {
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: { user: result.user, token: result.token },
      });
      return true;
    }
  };

  const logout = async () => {
    try {
      if (state.token) {
        await authAPI.logout(state.token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const setFormSubmitted = (submitted) => {
    dispatch({ type: AUTH_ACTIONS.SET_FORM_SUBMITTED, payload: submitted });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    setFormSubmitted,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};

export default AuthContext;

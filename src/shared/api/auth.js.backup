// Базовый URL API
const API_BASE_URL = 'https://wedev-api.sky.pro/api';

// Класс для работы с API авторизации
class AuthAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Общий метод для выполнения запросов
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Обрабатываем ответ
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.error || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error.message || 'Ошибка сети' };
    }
  }

  // Авторизация пользователя
  async login(email, password) {
    const result = await this.request('/user/login', {
      method: 'POST',
      body: JSON.stringify({
        login: email,
        password,
      }),
    });

    if (result.error) {
      return { error: result.error };
    }

    return {
      user: result.data.user,
      token: result.data.user.token,
    };
  }

  // Регистрация пользователя
  async register(name, email, password) {
    const result = await this.request('/user', {
      method: 'POST',
      body: JSON.stringify({
        name,
        login: email,
        password,
      }),
    });

    if (result.error) {
      return { error: result.error };
    }

    return {
      user: result.data.user,
      token: result.data.user.token,
    };
  }

  // Проверка токена
  async verifyToken(token) {
    const result = await this.request('/user', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (result.error) {
      throw new Error(result.error);
    }

    // Если API возвращает объект с массивом users, берем первого пользователя
    if (result.data && result.data.users && Array.isArray(result.data.users)) {
      const user = result.data.users[0];
      // Проверяем, что пользователь действительно авторизован
      if (!user || !user._id) {
        throw new Error('Invalid token');
      }
      return user;
    }

    // Если нет массива users, проверяем что данные пользователя корректны
    if (!result.data || !result.data._id) {
      throw new Error('Invalid token');
    }

    return result.data;
  }

  // Выход из системы
  async logout() {
    return Promise.resolve();
  }
}

// Создаем экземпляр API
const authAPI = new AuthAPI();

export default authAPI;

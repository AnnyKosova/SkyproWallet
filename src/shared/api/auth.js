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
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Обрабатываем ответ
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Авторизация пользователя
  async login(email, password) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Регистрация пользователя
  async register(name, email, password) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  // Проверка токена
  async verifyToken(token) {
    return this.request('/verify', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Выход из системы
  async logout(token) {
    return this.request('/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

// Создаем экземпляр API
const authAPI = new AuthAPI();

export default authAPI;

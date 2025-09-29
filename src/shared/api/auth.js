class AuthAPI {
  constructor() {
    this.baseURL = 'https://wedev-api.sky.pro/api';
  }

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
      const data = await response.json();

      if (!response.ok) {
        return { error: `HTTP error! status: ${response.status}` };
      }

      return { data };
    } catch (error) {
      return { error: error.message };
    }
  }

  async login(email, password) {
    const result = await this.request('/user/login', {
      method: 'POST',
      body: JSON.stringify({
        login: email,
        password,
      }),
    });

    if (result.error) {
      throw new Error(result.error);
    }

    return {
      user: result.data.user,
      token: result.data.user.token,
    };
  }

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
      throw new Error(result.error);
    }

    return {
      user: result.data.user,
      token: result.data.user.token,
    };
  }

  async verifyToken(token) {
    return { _id: "temp-user", name: "User", email: "user@example.com" };
  }

  logout() {
    localStorage.removeItem('token');
  }
}

export const authAPI = new AuthAPI();

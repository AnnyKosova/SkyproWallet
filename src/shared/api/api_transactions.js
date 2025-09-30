// api_transactions.js
const API_BASE_URL = 'https://wedev-api.sky.pro/api/transactions';


export class TransactionsAPI {
  constructor(token) {
    this.token = token;
  }

  async getTransactionsByPeriod(startDate, endDate) {
    try {
      // Проверяем наличие токена
      if (!this.token) {
        throw new Error('Токен авторизации не найден');
      }

      // Форматируем даты в нужный формат (MM-DD-YYYY)
      const formatDate = (date) => {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
      };

      const requestBody = {
        start: formatDate(startDate),
        end: formatDate(endDate)
      };

      const response = await fetch(`${API_BASE_URL}/period`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Ошибка авторизации. Неверный токен.');
        }
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении транзакций:', error);
      throw error;
    }
  }

  // Дополнительные методы для работы с транзакциями
  async getAllTransactions() {
    try {
      if (!this.token) {
        throw new Error('Токен авторизации не найден');
      }

      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Ошибка авторизации. Неверный токен.');
        }
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении транзакций:', error);
      throw error;
    }
  }

  async getFilteredTransactions(sortBy, filterBy) {
    try {
      if (!this.token) {
        throw new Error('Токен авторизации не найден');
      }

      let url = API_BASE_URL;
      const params = new URLSearchParams();
      
      if (sortBy) {
        params.append('sortBy', sortBy);
      }
      
      if (filterBy) {
        params.append('filterBy', filterBy);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Ошибка авторизации. Неверный токен.');
        }
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении транзакций:', error);
      throw error;
    }
  }
}
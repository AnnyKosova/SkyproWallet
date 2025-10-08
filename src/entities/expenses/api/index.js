import { CRUD } from '@/shared/api/index';

class ExpensesAPI extends CRUD {
  getAllExpenses() {
    return this._read('/transactions');
  }

  createExpense(body) {
    return this._create('/transactions', body);
  }

  deleteExpenseById(id) {
    return this._delete('/transactions', id);
  }
}

export const expensesAPI = new ExpensesAPI();

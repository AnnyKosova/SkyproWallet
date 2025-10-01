import { useReducer } from 'react';

import { ExpensesContext } from '@/shared/context/expenses-ctx/index';
import { expensesReducer } from '@/shared/context/expenses-ctx/index';
import { EXPENSES_ACTIONS } from '@/shared/context/expenses-ctx/index';
import { expensesAPI } from '@/entities/expenses';

const initialState = {
  expenses: [],
};

export const ExpensesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expensesReducer, initialState);

  const getAllExpenses = () => {
    return expensesAPI.getAllExpenses().then((response) => {
      dispatch({
        type: EXPENSES_ACTIONS.GET_ALL_EXPENSES,
        payload: response.data,
      });
      return response;
    });
  };

  const createExpense = (expense) => {
    return expensesAPI.createExpense(expense).then((response) => {
      dispatch({
        type: EXPENSES_ACTIONS.POST_EXPENSE,
        payload: response.data.transactions,
      });
      return response;
    });
  };

  const deleteExpense = (id) => {
    expensesAPI.deleteExpenseById(id).then((response) =>
      dispatch({
        type: EXPENSES_ACTIONS.DELETE_EXPENSE,
        payload: response.data.transactions,
      })
    );
  };
  return (
    <ExpensesContext.Provider
      value={{
        ...state,
        getAllExpenses,
        createExpense,
        deleteExpense,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

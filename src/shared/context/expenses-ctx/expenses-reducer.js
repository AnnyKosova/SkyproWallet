export const EXPENSES_ACTIONS = {
  GET_ALL_EXPENSES: 'GET_ALL_EXPENSES',
  POST_EXPENSE: 'POST_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',
};

export const expensesReducer = (state, action) => {
  switch (action.type) {
    case EXPENSES_ACTIONS.GET_ALL_EXPENSES:
    case EXPENSES_ACTIONS.POST_EXPENSE:
    case EXPENSES_ACTIONS.DELETE_EXPENSE:
      return {
        ...state,
        expenses: action.payload,
      };
    default:
      return state;
  }
};

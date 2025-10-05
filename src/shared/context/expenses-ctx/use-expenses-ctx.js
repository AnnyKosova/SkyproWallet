import { useContext } from "react";
import { ExpensesContext } from "./expenses-ctx";

export const useExpensesCtx = () => {
    const context = useContext(ExpensesContext);
    if(!context) {
        throw new Error(`useExpensesCtx использутся вне своего контекста`);
    }
    return context;
};
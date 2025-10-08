import { AppRouter } from './providers/index';
import { AuthProvider } from './providers/index';
import { ExpensesProvider } from './providers/index';
import './styles/index.css';

export function App() {
  return (
    <AuthProvider>
      <ExpensesProvider>
        <AppRouter />
      </ExpensesProvider>
    </AuthProvider>
  );
}

import { AppRouter } from './router';
import { AuthProvider } from '@/shared/context/AuthContext';
import './styles/index.css';

export function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

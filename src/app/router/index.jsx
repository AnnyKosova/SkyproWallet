import { AnalysisPage } from '@/pages/analysis/AnalysisPage';
import { ExpensesPage } from '@/pages/expenses/ExpensesPage';
import { LoginPage } from '@/pages/login/LoginPage';
import { RegisterPage } from '@/pages/register/RegisterPage';
import { useAuth } from '@/shared/context/AuthContext';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { Layout } from '../layouts';

// Компонент для защищенных маршрутов
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Показываем загрузку только при инициализации приложения
  if (isLoading && !isAuthenticated) {
    return <div>Загрузка...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Компонент для публичных маршрутов (только для неавторизованных)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Показываем загрузку только при инициализации приложения
  if (isLoading && !isAuthenticated) {
    return <div>Загрузка...</div>;
  }

  return !isAuthenticated ? children : <Navigate to="/expenses" replace />;
};

export function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Публичные страницы (только для неавторизованных) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Защищенные страницы (только для авторизованных) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/expenses" replace />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="analysis" element={<AnalysisPage />} />
        </Route>

        {/* Редирект на главную для несуществующих маршрутов */}
        <Route path="*" element={<Navigate to="/expenses" replace />} />
      </Routes>
    </Router>
  );
}

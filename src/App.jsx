import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Layout from './app/Layout';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import ExpensesPage from './pages/expenses/ExpensesPage';
import AnalysisPage from './pages/analysis/AnalysisPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Страницы без Header */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Страницы с Header */}
        <Route path="/" element={<Layout />}>
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

export default App;

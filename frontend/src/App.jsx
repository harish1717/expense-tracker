import { ThemeProvider } from './context/ThemeContext';
import Reports from './pages/Reports';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AllTransactions from './pages/AllTransactions';
import Categories from './pages/Categories';
import Dashboard from './pages/Dashboard';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
  path="/transactions"
  element={
    <PrivateRoute>
      <AllTransactions />
    </PrivateRoute>
  }
/>
            <Route
  path="/categories"
  element={
    <PrivateRoute>
      <Categories />
    </PrivateRoute>
  }
/>
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
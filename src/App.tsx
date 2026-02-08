import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TasksProvider } from './context/TasksContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import TaskList from './pages/TaskList';
import TaskForm from './pages/TaskForm';
import Login from './pages/Login';
import Register from './pages/Register';

function AppRoutes() {
  const { authEnabled, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Auth routes – only if auth is enabled */}
      {authEnabled && (
        <>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/tasks" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/tasks" replace /> : <Register />}
          />
        </>
      )}

      {/* Task routes – protected when auth enabled */}
      <Route element={<Layout />}>
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/new"
          element={
            <ProtectedRoute>
              <TaskForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/:id/edit"
          element={
            <ProtectedRoute>
              <TaskForm />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TasksProvider>
          <AppRoutes />
        </TasksProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

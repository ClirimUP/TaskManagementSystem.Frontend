import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { AUTH_ENABLED } from '../config';
import * as authApi from '../api/authApi';
import { parseApiError } from '../utils/errorParser';

interface AuthState {
  token: string | null;
  email: string | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  authEnabled: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    if (!AUTH_ENABLED) return { token: null, email: null, loading: false, error: null };

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    return { token, email, loading: false, error: null };
  });

  useEffect(() => {
    if (!AUTH_ENABLED) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await authApi.login({ email, password });
      localStorage.setItem('token', res.token);
      localStorage.setItem('email', res.email);
      setState({ token: res.token, email: res.email, loading: false, error: null });
      return true;
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: parseApiError(err) }));
      return false;
    }
  }, []);

  const register = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await authApi.register({ email, password });
      localStorage.setItem('token', res.token);
      localStorage.setItem('email', res.email);
      setState({ token: res.token, email: res.email, loading: false, error: null });
      return true;
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: parseApiError(err) }));
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setState({ token: null, email: null, loading: false, error: null });
  }, []);

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }));
  }, []);

  const value: AuthContextValue = {
    ...state,
    authEnabled: AUTH_ENABLED,
    isAuthenticated: !AUTH_ENABLED || !!state.token,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

import { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi } from '../api/auth.api';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: JSON.parse(user) },
        });
      } catch {
        localStorage.clear();
        dispatch({ type: 'LOGOUT' });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = (accessToken, refreshToken, user) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { user },
    });
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authApi.logout({ refreshToken });
      }
    } catch (error) {
      // Ignore logout API errors
    } finally {
      localStorage.clear();
      dispatch({ type: 'LOGOUT' });
    }
  };

  const hasRole = (role) => {
    if (!state.user?.roles) return false;
    if (Array.isArray(role)) {
      return role.some((r) => state.user.roles.includes(r));
    }
    return state.user.roles.includes(role);
  };

  const value = {
    ...state,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
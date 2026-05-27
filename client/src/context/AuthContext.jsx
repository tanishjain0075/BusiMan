import { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, fetchMe } from '../api/auth.api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('busiman_token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const rehydrate = async () => {
      if (token) {
        try {
          const { data } = await fetchMe();
          setUser(data.user || data);
        } catch {
          localStorage.removeItem('busiman_token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    rehydrate();
  }, [token]);

  const login = useCallback(async (formData) => {
    const { data } = await loginUser(formData);
    const t = data.token;
    localStorage.setItem('busiman_token', t);
    setToken(t);
    setUser(data.user || data);
    navigate('/dashboard');
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

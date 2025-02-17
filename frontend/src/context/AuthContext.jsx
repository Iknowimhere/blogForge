import { createContext, useContext, useState } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post('/user/register', userData);
      setUser(data);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      return true;
    } catch (err) {
      setError(err.response?.data.message || "Failed to register");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post('/user/login', { email, password });
      console.log(data);
      
      
      setUser(data);
      setToken(data.token);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      
      // Redirect based on role
    if (data.role === 'admin') {
      return '/admin/dashboard';
    }
    if(data.role==="author"){
      return "/author"
    }
    return '/';
    } catch (err) {
      setError(err.response?.data.message || "Failed to login");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateProfile = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.put('/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return true;
    } catch (err) {
      setError(err.response?.data.message || "Failed to update profile");
      throw err;
    } finally {
      setLoading(false);
    }
  };



  const getUserDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin';
      case 'author':
        return '/author';
      default:
        return '/';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      error, 
      login, 
      logout,
      register,
      updateProfile,
      isAuthenticated,
      getUserDashboard,
      isAdmin: () => user?.role === 'admin',
      isAuthor: () => user?.role === 'author'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
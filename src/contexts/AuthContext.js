import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('يجب استخدام useAuth داخل AuthProvider');
  }
  return context;
};

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');

      if (savedToken) {
        try {
          const response = await axios.get('/auth/verify');
          if (response.data.success) {
            setUser(response.data.user);
            setToken(savedToken);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('فشل التحقق من تسجيل الدخول:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/auth/login', {
        username,
        password
      });

      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;

        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);

        toast.success('تم تسجيل الدخول بنجاح!');
        return { success: true };
      } else {
        toast.error(response.data.message || 'فشل تسجيل الدخول');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);

      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data;

        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);

        toast.success('تم إنشاء الحساب بنجاح!');
        return { success: true };
      } else {
        toast.error(response.data.message || 'فشل إنشاء الحساب');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('تم تسجيل الخروج بنجاح');
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  const refreshUser = async () => {
    try {
      const response = await axios.get('/auth/verify');
      if (response.data.success) {
        setUser(response.data.user);
        return response.data.user;
      }
    } catch (error) {
      console.error('فشل تحديث بيانات المستخدم:', error);
      if (error.response?.status === 401) {
        logout();
      }
    }
    return null;
  };

  const addEarnings = (amount) => {
    setUser(prevUser => ({
      ...prevUser,
      balance: prevUser.balance + amount,
      totalEarned: prevUser.totalEarned + amount
    }));
  };

  const deductBalance = (amount) => {
    setUser(prevUser => ({
      ...prevUser,
      balance: prevUser.balance - amount
    }));
  };

  const updateTaskProgress = (taskNumber, progress) => {
    setUser(prevUser => ({
      ...prevUser,
      taskProgress: {
        ...prevUser.taskProgress,
        [`task${taskNumber}`]: {
          ...prevUser.taskProgress[`task${taskNumber}`],
          ...progress
        }
      }
    }));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    addEarnings,
    deductBalance,
    updateTaskProgress
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
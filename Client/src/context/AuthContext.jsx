import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5175/Login', { email, password });
      
      // Store token and user data
      localStorage.setItem('token', email);
      
      // Create user object with available data
      const userData = {
        email: email,
        name: email.split('@')[0], // Fallback name from email
        // Add more user data as needed from your backend response
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  // Signup function
  const signup = async (name, email, password) => {
    try {
      // Check if email already exists
      const usersResponse = await axios.get('http://localhost:5175/getUsers');
      const users = usersResponse.data;
      const emailExists = users.some(user => user.email === email);

      if (emailExists) {
        return { success: false, error: 'Email already exists. Please use another email.' };
      }

      // Proceed with signup
      const response = await axios.post('http://localhost:5175/Signup', { name, email, password });
      
      // Store token and user data
      localStorage.setItem('token', email);
      
      const userData = {
        email: email,
        name: name,
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.response?.data?.message || 'Signup failed' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Get user email for API calls
  const getUserEmail = () => {
    return user?.email || localStorage.getItem('token');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    getUserEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
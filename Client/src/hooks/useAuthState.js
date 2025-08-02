import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const useAuthState = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: null,
    loading: true
  });

  useEffect(() => {
    setAuthState({
      isLoggedIn: isAuthenticated,
      user: user,
      loading: loading
    });
  }, [isAuthenticated, user, loading]);

  return authState;
};

// Hook for checking if user is authenticated before making API calls
export const useRequireAuth = () => {
  const { isAuthenticated, loading } = useAuth();
  
  return {
    isAuthenticated,
    loading,
    requireAuth: (callback) => {
      if (!loading && !isAuthenticated) {
        // Redirect to login or show auth modal
        return false;
      }
      return callback();
    }
  };
}; 
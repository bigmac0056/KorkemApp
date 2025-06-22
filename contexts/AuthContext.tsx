import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        let token: string | null = null;
        let role: string | null = null;
        if (Platform.OS === 'web') {
          token = localStorage.getItem('userToken');
          role = localStorage.getItem('userRole');
        } else {
          token = await AsyncStorage.getItem('userToken');
          role = await AsyncStorage.getItem('userRole');
        }
        if (isMounted) {
          console.log('[AUTH] checkAuth: token', token, 'role', role);
          setIsAuthenticated(!!token);
          setUserRole(role);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        if (isMounted) {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      }
    };
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (token: string, role: string) => {
    try {
      console.log('[AUTH] login called with token:', token, 'role:', role);
      if (Platform.OS === 'web') {
        localStorage.setItem('userToken', token);
        localStorage.setItem('userRole', role);
      } else {
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userRole', role);
      }
      setIsAuthenticated(true);
      setUserRole(role);
      console.log('[AUTH] login: setIsAuthenticated(true), setUserRole', role);
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
      } else {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userRole');
      }
      setIsAuthenticated(false);
      setUserRole(null);
    } catch (error) {
      console.error('Error removing token:', error);
      throw error;
    }
  }, []);

  const contextValue = useMemo(() => ({
    isAuthenticated,
    login,
    logout,
    userRole
  }), [isAuthenticated, userRole, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
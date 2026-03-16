'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { api } from './api';

interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: 'developer' | 'admin';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  company?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('apex_token');
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const data = await api.get<User>('/auth/me');
      setUser(data);
    } catch (error) {
      localStorage.removeItem('apex_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const data = await api.post<{ token: string; developer: User }>('/auth/login', {
      email,
      password,
    });

    localStorage.setItem('apex_token', data.token);
    setUser(data.developer);
    router.push('/dashboard');
  };

  const register = async (registerData: RegisterData) => {
    const data = await api.post<{ token: string; developer: User }>(
      '/auth/register',
      registerData
    );

    localStorage.setItem('apex_token', data.token);
    setUser(data.developer);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('apex_token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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

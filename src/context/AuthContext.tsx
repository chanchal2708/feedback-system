import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'manager',
    teamMembers: ['2', '3', '4']
  },
  {
    id: '2',
    name: 'Alex Chen',
    email: 'alex@company.com',
    role: 'employee',
    managerId: '1'
  },
  {
    id: '3',
    name: 'Jordan Smith',
    email: 'jordan@company.com',
    role: 'employee',
    managerId: '1'
  },
  {
    id: '4',
    name: 'Maya Patel',
    email: 'maya@company.com',
    role: 'employee',
    managerId: '1'
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@company.com',
    role: 'manager',
    teamMembers: ['6', '7']
  },
  {
    id: '6',
    name: 'Emma Davis',
    email: 'emma@company.com',
    role: 'employee',
    managerId: '5'
  },
  {
    id: '7',
    name: 'Ryan Taylor',
    email: 'ryan@company.com',
    role: 'employee',
    managerId: '5'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('feedbackUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email (password is ignored for demo)
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('feedbackUser', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('feedbackUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
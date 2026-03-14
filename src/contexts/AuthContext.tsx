import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export type Role = 'admin' | 'staff' | null;

interface AuthContextType {
  role: Role;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize from sessionStorage to persist across simple reloads
  const [role, setRole] = useState<Role>(() => {
    const savedRole = sessionStorage.getItem('userRole');
    if (savedRole === 'admin' || savedRole === 'staff') {
      return savedRole;
    }
    return null;
  });

  useEffect(() => {
    if (role) {
      sessionStorage.setItem('userRole', role);
    } else {
      sessionStorage.removeItem('userRole');
    }
  }, [role]);

  const login = (username: string) => {
    // Simple mock logic
    if (username.toLowerCase() === 'admin') {
      setRole('admin');
      toast({ title: "Logged in successfully", description: "Welcome back, Admin." });
    } else if (username.toLowerCase() === 'staff') {
      setRole('staff');
      toast({ title: "Logged in successfully", description: "Welcome back, Staff member." });
    } else {
      // In a real app this would throw or handle errors differently, 
      // but for this mock we will just handle the routing/state in the Login page components.
      toast({ title: "Login Failed", description: "Invalid credentials.", variant: "destructive" });
    }
  };

  const logout = () => {
    setRole(null);
    toast({ title: "Logged out", description: "You have been successfully logged out." });
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
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

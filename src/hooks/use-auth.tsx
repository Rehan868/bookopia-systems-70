
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the user type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Staff User',
    email: 'staff@example.com',
    password: 'staff123',
    role: 'staff'
  },
  {
    id: '3',
    name: 'Owner User',
    email: 'owner@example.com',
    password: 'owner123',
    role: 'owner'
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if there's a saved session on initialization
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Mock login function
  const login = async (email: string, password: string, role?: string): Promise<void> => {
    // In a real app, this would be an API call
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        const foundUser = mockUsers.find(user => 
          user.email === email && 
          user.password === password &&
          (role ? user.role === role : true)
        );
        
        if (foundUser) {
          // Create a user object without the password
          const authenticatedUser = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role
          };
          
          // Save to state and localStorage
          setUser(authenticatedUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(authenticatedUser));
          
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500); // Simulate network delay
    });
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
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

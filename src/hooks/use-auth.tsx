
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

// Extended User type to include role and name properties
interface User extends SupabaseUser {
  role?: 'admin' | 'manager' | 'staff' | 'cleaner' | 'owner' | 'guest';
  name?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  ownerLogin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        
        // Extend the user with additional properties if needed
        if (currentSession?.user) {
          // In a real app, you would fetch the user's role from the database
          // For now, we'll just mock it with admin role and a name
          const extendedUser: User = {
            ...currentSession.user,
            role: 'admin', // Mock role
            name: currentSession.user.email?.split('@')[0] || 'User', // Mock name
          };
          setUser(extendedUser);
        } else {
          setUser(null);
        }
        
        setIsAuthenticated(!!currentSession);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      // Extend the user with additional properties if needed
      if (currentSession?.user) {
        // In a real app, you would fetch the user's role from the database
        const extendedUser: User = {
          ...currentSession.user,
          role: 'admin', // Mock role for now
          name: currentSession.user.email?.split('@')[0] || 'User', // Mock name
        };
        setUser(extendedUser);
      } else {
        setUser(null);
      }
      
      setIsAuthenticated(!!currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
  };

  const ownerLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    
    // In a real app, you would verify that this user is an owner
    // and redirect them to the owner dashboard
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      session,
      login,
      ownerLogin,
      logout
    }}>
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


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
        console.log('Auth state changed:', event);
        setSession(currentSession);
        
        // Extend the user with additional properties if needed
        if (currentSession?.user) {
          // In a real app, you would fetch the user's role from the database
          // Fetch additional user data from our users table
          const fetchUserData = async () => {
            try {
              const { data, error } = await supabase
                .from('users')
                .select('name, role, status')
                .eq('id', currentSession.user.id)
                .single();
                
              if (error) {
                console.error('Error fetching user data:', error);
                // Use default values if we can't fetch from database
                const extendedUser: User = {
                  ...currentSession.user,
                  role: 'staff',
                  name: currentSession.user.email?.split('@')[0] || 'User',
                };
                setUser(extendedUser);
                return;
              }
              
              if (data) {
                const extendedUser: User = {
                  ...currentSession.user,
                  role: data.role as 'admin' | 'manager' | 'staff' | 'cleaner' | 'owner' | 'guest',
                  name: data.name || currentSession.user.email?.split('@')[0] || 'User',
                };
                setUser(extendedUser);
              }
            } catch (err) {
              console.error('Error in fetchUserData:', err);
              // Use default values if we can't fetch from database
              const extendedUser: User = {
                ...currentSession.user,
                role: 'staff',
                name: currentSession.user.email?.split('@')[0] || 'User',
              };
              setUser(extendedUser);
            }
          };
          
          // Use setTimeout to avoid calling Supabase functions directly inside the callback
          setTimeout(fetchUserData, 0);
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
        // Fetch additional user data from our users table
        const fetchUserData = async () => {
          try {
            const { data, error } = await supabase
              .from('users')
              .select('name, role, status')
              .eq('id', currentSession.user.id)
              .single();
              
            if (error) {
              console.error('Error fetching user data:', error);
              // Use default values if we can't fetch from database
              const extendedUser: User = {
                ...currentSession.user,
                role: 'staff',
                name: currentSession.user.email?.split('@')[0] || 'User',
              };
              setUser(extendedUser);
              return;
            }
            
            if (data) {
              const extendedUser: User = {
                ...currentSession.user,
                role: data.role as 'admin' | 'manager' | 'staff' | 'cleaner' | 'owner' | 'guest',
                name: data.name || currentSession.user.email?.split('@')[0] || 'User',
              };
              setUser(extendedUser);
            }
          } catch (err) {
            console.error('Error in fetchUserData:', err);
            // Use default values if we can't fetch from database
            const extendedUser: User = {
              ...currentSession.user,
              role: 'staff',
              name: currentSession.user.email?.split('@')[0] || 'User',
            };
            setUser(extendedUser);
          }
        };
        
        fetchUserData();
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

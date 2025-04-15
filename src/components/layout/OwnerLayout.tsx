
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Sidebar as OwnerSidebar } from './OwnerSidebar';
import { Header } from './Header';

export function OwnerLayout() {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/owner/login" />;
  }
  
  if (user && user.role !== 'owner') {
    return <Navigate to="/owner/login" />;
  }
  
  return (
    <div className="flex min-h-screen">
      <OwnerSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 bg-background overflow-auto">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

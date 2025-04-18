
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/hooks/use-auth';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import OwnerLogin from '@/pages/OwnerLogin';
import PropertiesPage from '@/pages/PropertiesPage';
import BookingsPage from '@/pages/BookingsPage';
import BookingAdd from '@/pages/BookingAdd';
import BookingView from '@/pages/BookingView';
import BookingEdit from '@/pages/BookingEdit';
import CleaningTasksPage from '@/pages/CleaningTasksPage';
import EmailTemplatesPage from '@/pages/EmailTemplatesPage';
import OwnerDashboard from '@/pages/OwnerDashboard';
import OwnerCleaningStatus from '@/pages/OwnerCleaningStatus';
import OwnerBookings from '@/pages/OwnerBookings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/owner/login" element={<OwnerLogin />} />
            
            {/* Protected Staff Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/properties" 
              element={
                <ProtectedRoute>
                  <PropertiesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookings" 
              element={
                <ProtectedRoute>
                  <BookingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookings/add" 
              element={
                <ProtectedRoute>
                  <BookingAdd />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookings/:id" 
              element={
                <ProtectedRoute>
                  <BookingView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookings/edit/:id" 
              element={
                <ProtectedRoute>
                  <BookingEdit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cleaning-tasks" 
              element={
                <ProtectedRoute>
                  <CleaningTasksPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/email-templates" 
              element={
                <ProtectedRoute>
                  <EmailTemplatesPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Owner Routes */}
            <Route 
              path="/owner/dashboard" 
              element={
                <ProtectedRoute ownerOnly>
                  <OwnerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/owner/cleaning" 
              element={
                <ProtectedRoute ownerOnly>
                  <OwnerCleaningStatus />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/owner/bookings" 
              element={
                <ProtectedRoute ownerOnly>
                  <OwnerBookings />
                </ProtectedRoute>
              } 
            />
            
            {/* Default route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

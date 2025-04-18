
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import Dashboard from '@/pages/Dashboard';
import Bookings from '@/pages/Bookings';
import Rooms from '@/pages/Rooms';
import Users from '@/pages/Users';
import Owners from '@/pages/Owners';
import Expenses from '@/pages/Expenses';
import Settings from '@/pages/Settings';
import { BookingDetails } from '@/components/bookings/BookingDetails';
import BookingAdd from '@/pages/BookingAdd';
import BookingEdit from '@/pages/BookingEdit';
import RoomAdd from '@/pages/RoomAdd';
import RoomEdit from '@/pages/RoomEdit';
import Login from '@/pages/Login';
import OwnerLogin from '@/pages/OwnerLogin';
import CleaningTasksPage from '@/pages/CleaningTasksPage';
import EmailTemplatesPage from '@/pages/EmailTemplatesPage';
import PropertiesPage from '@/pages/PropertiesPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  // Define a function to check if the user has the required role
  const hasRequiredRole = (requiredRoles: string[]) => {
    return user && user.role && requiredRoles.includes(user.role);
  };

  // Custom route component to protect routes based on authentication and roles
  const PrivateRoute = ({ children, requiredRoles }: { children: React.ReactNode; requiredRoles?: string[] }) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      return <Navigate to="/login" />;
    }

    if (requiredRoles && !hasRequiredRole(requiredRoles)) {
      // Redirect to a "unauthorized" page or a default page if the role is not authorized
      return <Navigate to="/unauthorized" />;
    }

    return children;
  };

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/owner/login" element={<OwnerLogin />} />
      <Route path="/unauthorized" element={<div>Unauthorized</div>} />

      {/* Define routes that require authentication */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <PrivateRoute>
            <Bookings />
          </PrivateRoute>
        }
      />
      <Route
        path="/bookings/:id"
        element={
          <PrivateRoute>
            <BookingDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/bookings/add"
        element={
          <PrivateRoute>
            <BookingAdd />
          </PrivateRoute>
        }
      />
      <Route
        path="/bookings/:id/edit"
        element={
          <PrivateRoute>
            <BookingEdit />
          </PrivateRoute>
        }
      />
      <Route
        path="/rooms"
        element={
          <PrivateRoute>
            <Rooms />
          </PrivateRoute>
        }
      />
      <Route
        path="/rooms/add"
        element={
          <PrivateRoute>
            <RoomAdd />
          </PrivateRoute>
        }
      />
      <Route
        path="/rooms/:id/edit"
        element={
          <PrivateRoute>
            <RoomEdit />
          </PrivateRoute>
        }
      />
      <Route
        path="/users"
        element={
          <PrivateRoute requiredRoles={['admin']}>
            <Users />
          </PrivateRoute>
        }
      />
      <Route
        path="/owners"
        element={
          <PrivateRoute requiredRoles={['admin']}>
            <Owners />
          </PrivateRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <PrivateRoute>
            <Expenses />
          </PrivateRoute>
        }
      />
      <Route
        path="/cleaning-tasks"
        element={
          <PrivateRoute>
            <CleaningTasksPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/email-templates"
        element={
          <PrivateRoute>
            <EmailTemplatesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/properties"
        element={
          <PrivateRoute>
            <PropertiesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;

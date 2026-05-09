// App.jsx - main app with all routes (updated with all new pages)
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Bookings from './pages/Bookings';
import AIAssistant from './pages/AIAssistant';
import CreateUser from './pages/CreateUser';
import Guests from './pages/Guests';
import Invoices from './pages/Invoices';
import Housekeeping from './pages/Housekeeping';
import Maintenance from './pages/Maintenance';
import Feedback from './pages/Feedback';
import Services from './pages/Services';
import StaffManagement from './pages/StaffManagement';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

// helper - protected route with layout wrap karo
const ProtectedPage = ({ children }) => (
  <ProtectedRoute><Layout>{children}</Layout></ProtectedRoute>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
          <Route path="/rooms" element={<ProtectedPage><Rooms /></ProtectedPage>} />
          <Route path="/bookings" element={<ProtectedPage><Bookings /></ProtectedPage>} />
          <Route path="/guests" element={<ProtectedPage><Guests /></ProtectedPage>} />
          <Route path="/invoices" element={<ProtectedPage><Invoices /></ProtectedPage>} />
          <Route path="/services" element={<ProtectedPage><Services /></ProtectedPage>} />
          <Route path="/housekeeping" element={<ProtectedPage><Housekeeping /></ProtectedPage>} />
          <Route path="/maintenance" element={<ProtectedPage><Maintenance /></ProtectedPage>} />
          <Route path="/feedback" element={<ProtectedPage><Feedback /></ProtectedPage>} />
          <Route path="/ai-assistant" element={<ProtectedPage><AIAssistant /></ProtectedPage>} />
          <Route path="/notifications" element={<ProtectedPage><Notifications /></ProtectedPage>} />
          <Route path="/staff" element={<ProtectedPage><StaffManagement /></ProtectedPage>} />
          <Route path="/create-user" element={<ProtectedPage><CreateUser /></ProtectedPage>} />
          <Route path="/settings" element={<ProtectedPage><Settings /></ProtectedPage>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

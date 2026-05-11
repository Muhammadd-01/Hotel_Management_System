// App.jsx - Main router with separate Admin and Website panels
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';
import './website.css';
import ScrollToTop from './website/components/ScrollToTop';

// Admin Components & Pages
import AdminProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/components/Layout';
import AdminDashboard from './admin/pages/Dashboard';
import AdminRooms from './admin/pages/Rooms';
import AdminBookings from './admin/pages/Bookings';
import AdminGuests from './admin/pages/Guests';
import AdminInvoices from './admin/pages/Invoices';
import AdminServices from './admin/pages/Services';
import AdminHousekeeping from './admin/pages/Housekeeping';
import AdminMaintenance from './admin/pages/Maintenance';
import AdminFeedback from './admin/pages/Feedback';
import AdminAIAssistant from './admin/pages/AIAssistant';
import AdminNotifications from './admin/pages/Notifications';
import AdminStaffManagement from './admin/pages/StaffManagement';
import AdminCreateUser from './admin/pages/CreateUser';
import AdminSettings from './admin/pages/Settings';
import AdminLogin from './admin/pages/Login';
import AdminRegister from './admin/pages/Register';

// Website Components & Pages
import WebsiteLayout from './website/components/WebsiteLayout';
import Home from './website/pages/Home';
import RoomsExplore from './website/pages/RoomsExplore';
import About from './website/pages/About';
import Amenities from './website/pages/Amenities';
import Gallery from './website/pages/Gallery';
import Contact from './website/pages/Contact';
import BookRoom from './website/pages/BookRoom';
import GuestFeedback from './website/pages/GuestFeedback';
import RoomDetails from './website/pages/RoomDetails';
import Checkout from './website/pages/Checkout';
import Profile from './website/pages/Profile';
import Login from './website/pages/Login';
import Register from './website/pages/Register';

// Helpers
const AdminPage = ({ children }) => (
  <AdminProtectedRoute><AdminLayout>{children}</AdminLayout></AdminProtectedRoute>
);

const WebPage = ({ children }) => (
  <WebsiteLayout>{children}</WebsiteLayout>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* ====== PUBLIC WEBSITE ROUTES ====== */}
        <Route path="/" element={<WebPage><Home /></WebPage>} />
        <Route path="/rooms-explore" element={<WebPage><RoomsExplore /></WebPage>} />
        <Route path="/about" element={<WebPage><About /></WebPage>} />
        <Route path="/amenities" element={<WebPage><Amenities /></WebPage>} />
        <Route path="/gallery" element={<WebPage><Gallery /></WebPage>} />
        <Route path="/contact" element={<WebPage><Contact /></WebPage>} />
        <Route path="/book-room" element={<WebPage><BookRoom /></WebPage>} />
        <Route path="/room-details/:type" element={<WebPage><RoomDetails /></WebPage>} />
        <Route path="/checkout" element={<WebPage><Checkout /></WebPage>} />
        <Route path="/guest-feedback" element={<WebPage><GuestFeedback /></WebPage>} />
        <Route path="/profile" element={<WebPage><Profile /></WebPage>} />

        {/* ====== AUTH ROUTES ====== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ====== ADMIN / MANAGEMENT PANEL ROUTES ====== */}
        <Route path="/dashboard" element={<AdminPage><AdminDashboard /></AdminPage>} />
        <Route path="/rooms" element={<AdminPage><AdminRooms /></AdminPage>} />
        <Route path="/bookings" element={<AdminPage><AdminBookings /></AdminPage>} />
        <Route path="/guests" element={<AdminPage><AdminGuests /></AdminPage>} />
        <Route path="/invoices" element={<AdminPage><AdminInvoices /></AdminPage>} />
        <Route path="/services" element={<AdminPage><AdminServices /></AdminPage>} />
        <Route path="/housekeeping" element={<AdminPage><AdminHousekeeping /></AdminPage>} />
        <Route path="/maintenance" element={<AdminPage><AdminMaintenance /></AdminPage>} />
        <Route path="/feedback" element={<AdminPage><AdminFeedback /></AdminPage>} />
        <Route path="/ai-assistant" element={<AdminPage><AdminAIAssistant /></AdminPage>} />
        <Route path="/notifications" element={<AdminPage><AdminNotifications /></AdminPage>} />
        <Route path="/staff" element={<AdminPage><AdminStaffManagement /></AdminPage>} />
        <Route path="/create-user" element={<AdminPage><AdminCreateUser /></AdminPage>} />
        <Route path="/settings" element={<AdminPage><AdminSettings /></AdminPage>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

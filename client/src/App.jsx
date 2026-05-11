// App.jsx - Main router with separate Admin and Website panels
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';
import './website.css';
import ScrollToTop from './website/components/ScrollToTop';

// Admin Pages - Lazy Loaded
const AdminProtectedRoute = lazy(() => import('./admin/components/ProtectedRoute'));
const AdminLayout = lazy(() => import('./admin/components/Layout'));
const AdminDashboard = lazy(() => import('./admin/pages/Dashboard'));
const AdminRooms = lazy(() => import('./admin/pages/Rooms'));
const AdminBookings = lazy(() => import('./admin/pages/Bookings'));
const AdminGuests = lazy(() => import('./admin/pages/Guests'));
const AdminInvoices = lazy(() => import('./admin/pages/Invoices'));
const AdminServices = lazy(() => import('./admin/pages/Services'));
const AdminHousekeeping = lazy(() => import('./admin/pages/Housekeeping'));
const AdminMaintenance = lazy(() => import('./admin/pages/Maintenance'));
const AdminFeedback = lazy(() => import('./admin/pages/Feedback'));
const AdminAIAssistant = lazy(() => import('./admin/pages/AIAssistant'));
const AdminNotifications = lazy(() => import('./admin/pages/Notifications'));
const AdminStaffManagement = lazy(() => import('./admin/pages/StaffManagement'));
const AdminCreateUser = lazy(() => import('./admin/pages/CreateUser'));
const AdminSettings = lazy(() => import('./admin/pages/Settings'));
const AdminAddons = lazy(() => import('./admin/pages/Addons'));
const AdminLogin = lazy(() => import('./admin/pages/Login'));
const AdminRegister = lazy(() => import('./admin/pages/Register'));

// Website Pages - Lazy Loaded
const WebsiteLayout = lazy(() => import('./website/components/WebsiteLayout'));
const Home = lazy(() => import('./website/pages/Home'));
const RoomsExplore = lazy(() => import('./website/pages/RoomsExplore'));
const About = lazy(() => import('./website/pages/About'));
const Amenities = lazy(() => import('./website/pages/Amenities'));
const Gallery = lazy(() => import('./website/pages/Gallery'));
const Contact = lazy(() => import('./website/pages/Contact'));
const BookRoom = lazy(() => import('./website/pages/BookRoom'));
const GuestFeedback = lazy(() => import('./website/pages/GuestFeedback'));
const RoomDetails = lazy(() => import('./website/pages/RoomDetails'));
const Checkout = lazy(() => import('./website/pages/Checkout'));
const Profile = lazy(() => import('./website/pages/Profile'));
const Login = lazy(() => import('./website/pages/Login'));
const Register = lazy(() => import('./website/pages/Register'));

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
      <Suspense fallback={<div className="page-loading"><div className="spinner"></div></div>}>
        <Routes>
          {/* ====== PUBLIC WEBSITE ROUTES ====== */}
          <Route path="/" element={<WebPage><Home /></WebPage>} />
          <Route path="/rooms-explore" element={<WebPage><RoomsExplore /></WebPage>} />
          <Route path="/about" element={<WebPage><About /></WebPage>} />
          <Route path="/amenities" element={<WebPage><Amenities /></WebPage>} />
          <Route path="/gallery" element={<WebPage><Gallery /></WebPage>} />
          <Route path="/contact" element={<WebPage><Contact /></WebPage>} />
          <Route path="/book-room" element={<WebPage><BookRoom /></WebPage>} />
          <Route path="/room-details/:id" element={<WebPage><RoomDetails /></WebPage>} />
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
          <Route path="/addons" element={<AdminPage><AdminAddons /></AdminPage>} />
          <Route path="/settings" element={<AdminPage><AdminSettings /></AdminPage>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

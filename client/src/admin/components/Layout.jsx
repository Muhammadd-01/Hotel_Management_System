// Layout.jsx - Main wrapper for the admin panel layout (Sidebar + Content Area)
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      {/* Navigation Sidebar */}
      <Sidebar />
      {/* Main Content Area */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;

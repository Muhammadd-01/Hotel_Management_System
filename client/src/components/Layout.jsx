// Layout.jsx - yeh component main layout wrap karta hai (sidebar + content area)
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      {/* Left side mein sidebar */}
      <Sidebar />
      {/* Right side mein main content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;

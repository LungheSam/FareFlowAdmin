import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import '../../styles/AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user] = useAuthState(auth);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="admin-container">
      <button className="menu-btn" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <h2>FareFlow</h2>
        <nav>
          <Link to="/" className="nav-link">
            <i className='bx bxs-dashboard'></i>Dashboard
          </Link>
          <Link to="/register" className="nav-link">
            <i className='bx bxs-id-card'></i>Registration
          </Link>
          <Link to="/passengers" className="nav-link">
            <i className='bx bxs-user'></i>Registered Users
          </Link>
          <Link to="/drivers" className="nav-link">
            <i className='bx bxs-user-detail'></i>Registered Drivers
          </Link>

          <Link to="/bustracking" className="nav-link">
            <i className='bx bxs-bus-school'></i>Bus Tracking
          </Link>
          <Link to="/earningsanalysis" className="nav-link">
            < i className='bx  bx-pie-chart'  ></i>  Earnings Analysis
          </Link>
          <button onClick={handleLogout} className="nav-link logout-link">
            <i className='bx bx-log-out'></i>Logout
          </button>
        </nav>
      </div>

      <div className="main-content">
        <header className="admin-header">
          <h1>FareFlow Admin</h1>
          <div className="user-info">
            <span>{user?.email}</span>
            {/* Added small logout button in header */}
            <button onClick={handleLogout} className="header-logout" title="Logout">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
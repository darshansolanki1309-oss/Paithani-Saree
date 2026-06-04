import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChartLine, FaShoppingBag, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>PyThani<span>Admin</span></h2>
      </div>

      <nav className="sidebar-nav">
        <Link 
          to="/" 
          className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
        >
          <FaChartLine /> Dashboard
        </Link>
        <Link 
          to="/orders" 
          className={`nav-item ${location.pathname === '/orders' ? 'active' : ''}`}
        >
          <FaShoppingBag /> Orders
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
import React, { useEffect, useState } from 'react';
import { FaMoneyBillWave, FaShoppingCart, FaClock, FaCheckCircle } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0
  });

  // Fetch stats from your Node.js server
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Failed to load stats", err));
  }, []);

  // Mock data for the chart (until we have real historical data)
  const chartData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  return (
    <div className="page-content">
      <header className="header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back, Admin</p>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="icon-box blue"><FaMoneyBillWave /></div>
          <div>
            <h3>Total Sales</h3>
            <p className="stat-value">₹{stats.totalSales.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="icon-box orange"><FaShoppingCart /></div>
          <div>
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
        </div>
        <div className="stat-card yellow">
          <div className="icon-box yellow"><FaClock /></div>
          <div>
            <h3>Pending</h3>
            <p className="stat-value">{stats.processingOrders}</p>
          </div>
        </div>
        <div className="stat-card green">
          <div className="icon-box green"><FaCheckCircle /></div>
          <div>
            <h3>Delivered</h3>
            <p className="stat-value">{stats.deliveredOrders}</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-container">
        <h3>Weekly Sales Performance</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="sales" fill="#002D62" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
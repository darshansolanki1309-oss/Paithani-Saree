import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/orders`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
        setIsLoading(false);
      });
  };

  // Handle Status Update (Accept/Deny)
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchOrders(); // Refresh the list
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (isLoading) return <div className="orders-loading">Loading Orders...</div>;

  return (
    <div className="orders-page">
      <header className="orders-header">
        <h1>Order Management</h1>
        <p>Manage incoming customer requests</p>
      </header>

      <div className="orders-grid">
        {orders.length === 0 ? (
          <p className="no-orders">No orders found.</p>
        ) : (
          orders.map(order => (
            <div className="order-card" key={order._id}>
              
              {/* HEADER: Order ID & Date */}
              <div className="order-card-header">
                <span className="order-id">#{order._id.slice(-6)}</span>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* BODY: Products */}
              <div className="order-products-row">
                {order.items && order.items.map((item, i) => (
                  <img key={i} src={item.imageUrl} alt="Item" className="order-thumb" />
                ))}
              </div>

              {/* DETAILS: Customer Info */}
              <div className="order-details">
                <h3>{order.userDetails?.firstName || 'Unknown'} {order.userDetails?.lastName || ''}</h3>
                <p className="detail-row">
                  <FaPhone className="icon" /> {order.userDetails?.mobile || 'N/A'}
                </p>
                <p className="detail-row address">
                  <FaMapMarkerAlt className="icon" /> {order.userDetails?.address || 'No Address'}
                </p>
                <p className="detail-row payment">
                  Payment: <strong>{(order.userDetails?.paymentMethod || 'COD').toUpperCase()}</strong>
                </p>
              </div>

              {/* FOOTER: Status & Actions */}
              <div className="order-actions">
                {/* --- FIX IS HERE: Default to 'Processing' if status is missing --- */}
                {(order.status || 'Processing') === 'Processing' ? (
                  <>
                    <button 
                      className="action-btn deny"
                      onClick={() => handleStatusUpdate(order._id, 'Cancelled')}
                    >
                      <FaTimes /> Deny
                    </button>
                    <button 
                      className="action-btn accept"
                      onClick={() => handleStatusUpdate(order._id, 'Accepted')}
                    >
                      <FaCheck /> Accept
                    </button>
                  </>
                ) : (
                  <div className={`status-badge-large ${(order.status || 'Processing').toLowerCase()}`}>
                    {order.status || 'Processing'}
                  </div>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Orders;

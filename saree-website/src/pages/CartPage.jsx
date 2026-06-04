import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './CartPage.css';

// 1. Accept the new 'isLoggedIn' prop
function CartPage({ cartItems, isLoggedIn }) {
  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      
      {/* 2. This is the new logic */}
      {!isLoggedIn ? (
        // If user is NOT logged in, show this
        <div className="cart-logged-out">
          <p>Please login to view your cart and add items.</p>
          {/* We'll re-use the login button style */}
          <Link to="/" className="login-button-link">
            Go to Homepage
          </Link>
        </div>
      ) : cartItems.length === 0 ? (
        // If user IS logged in, but cart is empty
        <p className="cart-empty-message">Your cart is currently empty.</p>
      ) : (
        // If user IS logged in and has items
        <div className="cart-items-list">
          {cartItems.map((item, index) => (
            <div className="cart-item" key={item._id || index}>
              <img src={item.imageUrl} alt="Shree Design" className="cart-item-image" />
              <div className="cart-item-details">
                <h3>AI Generated Shree Design #{index + 1}</h3>
                {typeof item.price === 'number' && (
                  <p className="cart-item-price">Rs. {item.price.toLocaleString('en-IN')}</p>
                )}
              </div>
              <button className="cart-item-remove">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CartPage;
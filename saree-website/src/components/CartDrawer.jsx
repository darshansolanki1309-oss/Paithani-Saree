import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';
import './CartDrawer.css';

function CartDrawer({ isCartOpen, onCartClose, cartItems, isLoggedIn, onRemoveItem, onCheckout }) {
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false); // NEW: Track form visibility

  const formatPrice = (value) => {
    if (typeof value !== 'number') return 'Price on request';
    return `Rs. ${value.toLocaleString('en-IN')}`;
  };

  // NEW: State for form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    address: '',
    paymentMethod: 'cod' // Default to Cash on Delivery
  });

  // Reset states when cart is closed
  useEffect(() => {
    if (!isCartOpen) {
      setTimeout(() => {
        setShowSuccess(false);
        setShowCheckoutForm(false);
        setFormData({ firstName: '', lastName: '', mobile: '', address: '', paymentMethod: 'cod' });
      }, 300);
    }
  }, [isCartOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    // --- NEW: Pass the form data to the App.jsx function ---
    onCheckout(formData); 
    
    setShowSuccess(true);
    setShowCheckoutForm(false);

    setTimeout(() => {
      onCartClose();
    }, 3000);
  };
  
  return (
    <>
      <div 
        className={`cart-overlay ${isCartOpen ? 'is-visible' : ''}`}
        onClick={onCartClose}
      />
      
      <div className={`cart-drawer ${isCartOpen ? 'is-open' : ''}`}>
        <div className="cart-header">
          <h2>{showCheckoutForm ? 'Checkout' : 'Your Cart'}</h2>
          <button className="cart-close-btn" onClick={onCartClose}>
            <FaTimes />
          </button>
        </div>

        {/* --- VIEW 1: SUCCESS MESSAGE --- */}
        {showSuccess ? (
          <div className="cart-success-message">
            <FaCheckCircle className="success-icon" />
            <h3>Thank You, {formData.firstName}!</h3>
            <p>Your order has been placed successfully.</p>
            <p className="order-subtext">We will contact you at {formData.mobile} shortly.</p>
          </div>
        ) : showCheckoutForm ? (
          
          /* --- VIEW 2: CHECKOUT FORM --- */
          <div className="cart-body checkout-body">
            <form className="checkout-form" onSubmit={handlePlaceOrder}>
              <div className="form-group">
                <label>First Name</label>
                <input 
                  type="text" name="firstName" required 
                  value={formData.firstName} onChange={handleInputChange}
                  placeholder="Enter first name"
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input 
                  type="text" name="lastName" required 
                  value={formData.lastName} onChange={handleInputChange}
                  placeholder="Enter surname"
                />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input 
                  type="tel" name="mobile" required 
                  value={formData.mobile} onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                />
              </div>
              <div className="form-group">
                <label>Delivery Address</label>
                <textarea 
                  name="address" required 
                  value={formData.address} onChange={handleInputChange}
                  placeholder="Full address with pincode"
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}>
                  <option value="cod">Cash on Delivery</option>
                  <option value="upi">UPI / Online Payment</option>
                </select>
              </div>

              <div className="checkout-actions">
                <button type="button" className="back-btn" onClick={() => setShowCheckoutForm(false)}>
                  Back to Cart
                </button>
                <button type="submit" className="place-order-btn">
                  Place Order
                </button>
              </div>
            </form>
          </div>

        ) : (

          /* --- VIEW 3: CART ITEMS LIST --- */
          <div className="cart-body">
            {!isLoggedIn ? (
              <div className="cart-logged-out">
                <p>Please login to view your cart.</p>
              </div>
            ) : cartItems.length === 0 ? (
              <p className="cart-empty-message">Your cart is currently empty.</p>
            ) : (
              <div className="cart-items-list">
                {cartItems.map((item, index) => (
                  <div className="cart-item" key={item._id}>
                    <img src={item.imageUrl} alt="Saree Design" className="cart-item-image" />
                    <div className="cart-item-details">
                      <h3>AI Generated Design #{index + 1}</h3>
                      <p className="cart-item-price">{formatPrice(item.price)}</p>
                    </div>
                    <button 
                      className="cart-item-remove"
                      onClick={() => onRemoveItem(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Only show "Proceed to Checkout" button if we are in the Cart View (not form, not success) */}
        {!showSuccess && !showCheckoutForm && isLoggedIn && cartItems.length > 0 && (
          <div className="cart-footer">
            <button className="checkout-button" onClick={() => setShowCheckoutForm(true)}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
import React from 'react';
import './DesignCard.css';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { SignInButton } from '@clerk/clerk-react';

// Accept the new 'userId' and 'onCardClick' prop
function DesignCard({ imageUrl, price, isLoggedIn, onAddToCart, userId, onCardClick }) {

  const formatPrice = (value) => {
    if (typeof value !== 'number') return 'Price on request';
    return `Rs. ${value.toLocaleString('en-IN')}`;
  };

  const handleLoggedInClick = (e) => {
    e.stopPropagation(); 
    // Pass both the imageUrl and the userId to the cart function
    onAddToCart({ imageUrl, price }); 
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick({ imageUrl, price });
    }
  };

  return (
    <div className="design-card-masonry" onClick={handleCardClick}>
      <div className="card-image-wrapper">
        <div className="price-badge">{formatPrice(price)}</div>
        <img 
          src={imageUrl || 'https://via.placeholder.com/400x500.png?text=Saree+Design'} 
          alt="AI Generated Saree Design" 
          className="card-image-masonry" 
        />
      </div>
      
      <div className="card-overlay">
        <button className="card-btn-view" onClick={(e) => { e.stopPropagation(); handleCardClick(); }}>
          <FaEye /> View Details
        </button>
        {isLoggedIn ? (
          // If logged in, call the handler that passes the userId
          <button className="card-btn-overlay" onClick={handleLoggedInClick}>
            <FaShoppingCart /> Add to Cart
          </button>
        ) : (
          // If not logged in, Clerk's button will open the login modal
          <SignInButton mode="modal" afterSignInUrl="/" afterSignUpUrl="/">
            <button className="card-btn-overlay" onClick={(e) => e.stopPropagation()}>
              <FaShoppingCart /> Add to Cart
            </button>
          </SignInButton>
        )}
      </div>
    </div>
  );
}

export default DesignCard;
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import './Navbar.css';
import { SignInButton, UserButton, useUser } from '@clerk/clerk-react';

function Navbar({ cartItemCount, onClearCart, onCartClick }) {
  
  const { isSignedIn } = useUser();

  // Function to scroll to top (unchanged)
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* --- THIS BLOCK IS CHANGED --- */}
        {/* 1. Left Side: Logo */}
        <Link to="/" className="navbar-logo-link" onClick={scrollToTop}>
          <img src="/sareelogo.PNG" alt="PyThani Logo" className="navbar-logo-image" />
        </Link>
        {/* --- END OF CHANGE --- */}
        
        {/* 2. Center: New Navigation Links */}
        <ul className="nav-menu-center">
          <li><Link to="/" className="nav-links-center" onClick={scrollToTop}>Home</Link></li>
          <li><a href="#about" className="nav-links-center">About</a></li>
          <li><a href="#features" className="nav-links-center">Features</a></li>
        </ul>

        {/* 3. Right Side: Icons */}
        <div className="nav-icons">
          <button className="nav-icon-button cart-button" onClick={onCartClick}>
            <FaShoppingCart />
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </button>
          
          {isSignedIn ? (
            <div className="nav-user-button">
              <UserButton 
                afterSignOutUrl="/" 
                onSignOut={() => onClearCart()} 
              />
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="nav-icon-button">
                <FaUserCircle />
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
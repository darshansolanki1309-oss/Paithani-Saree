import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import './Navbar.css';
import { SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home', href: '/', isRoute: true },
  { label: 'About', href: '#about', isRoute: false },
  { label: 'Features', href: '#features', isRoute: false },
];

function Navbar({ cartItemCount, onClearCart, onCartClick }) {
  const { isSignedIn } = useUser();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo-link" onClick={scrollToTop}>
          <motion.img
            src="/sareelogo.PNG"
            alt="pAIThani Logo"
            className="navbar-logo-image"
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          />
        </Link>

        {/* Center Nav Links */}
        <ul className="nav-menu-center">
          {NAV_LINKS.map((item, i) => (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: 'easeOut' }}
            >
              {item.isRoute ? (
                <Link to={item.href} className="nav-links-center" onClick={scrollToTop}>
                  {item.label}
                </Link>
              ) : (
                <a href={item.href} className="nav-links-center">
                  {item.label}
                </a>
              )}
            </motion.li>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="nav-icons">
          {isSignedIn ? (
            <>
              <motion.button
                className="cart-button"
                onClick={onCartClick}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
              >
                <FaShoppingCart size={20} />
                <AnimatePresence mode="wait">
                  {cartItemCount > 0 && (
                    <motion.span
                      key={cartItemCount}
                      className="cart-badge"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <div className="nav-user-button">
                <UserButton afterSignOutUrl="/" />
              </div>
            </>
          ) : (
            <>
              <motion.button
                className="cart-button"
                onClick={onCartClick}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
              >
                <FaShoppingCart size={20} />
              </motion.button>
              <SignInButton mode="modal" afterSignInUrl="/" afterSignUpUrl="/">
                <motion.button
                  className="nav-icon-button"
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <FaUserCircle size={22} />
                </motion.button>
              </SignInButton>
            </>
          )}
        </div>

      </div>
    </motion.nav>
  );
}

export default Navbar;

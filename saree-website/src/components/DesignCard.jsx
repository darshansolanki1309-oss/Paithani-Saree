import React, { useRef } from 'react';
import './DesignCard.css';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { SignInButton } from '@clerk/clerk-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

function DesignCard({ imageUrl, price, isLoggedIn, onAddToCart, userId, onCardClick }) {

  const cardRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), { stiffness: 350, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), { stiffness: 350, damping: 30 });
  const glareX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) / rect.width);
    y.set((e.clientY - rect.top - rect.height / 2) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const formatPrice = (value) => {
    if (typeof value !== 'number') return 'Price on request';
    return `Rs. ${value.toLocaleString('en-IN')}`;
  };

  const handleLoggedInClick = (e) => {
    e.stopPropagation();
    onAddToCart({ imageUrl, price });
  };

  const handleCardClick = () => {
    if (onCardClick) onCardClick({ imageUrl, price });
  };

  return (
    <motion.div
      ref={cardRef}
      className="design-card-masonry"
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      whileHover={{ scale: 1.02, boxShadow: '0 24px 64px rgba(12, 26, 53, 0.22)' }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
    >
      <div className="card-image-wrapper">
        <motion.div
          className="price-badge"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {formatPrice(price)}
        </motion.div>

        <img
          src={imageUrl || 'https://via.placeholder.com/400x500.png?text=Saree+Design'}
          alt="AI Generated Saree Design"
          className="card-image-masonry"
          loading="lazy"
        />

        <motion.div
          className="card-glare"
          style={{
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.18) 0%, transparent 60%)`,
          }}
        />
      </div>

      <div className="card-overlay">
        <button
          className="card-btn-view"
          onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
        >
          <FaEye /> View Details
        </button>
        {isLoggedIn ? (
          <button className="card-btn-overlay" onClick={handleLoggedInClick}>
            <FaShoppingCart /> Add to Cart
          </button>
        ) : (
          <SignInButton mode="modal" afterSignInUrl="/" afterSignUpUrl="/">
            <button className="card-btn-overlay" onClick={(e) => e.stopPropagation()}>
              <FaShoppingCart /> Add to Cart
            </button>
          </SignInButton>
        )}
      </div>
    </motion.div>
  );
}

export default DesignCard;

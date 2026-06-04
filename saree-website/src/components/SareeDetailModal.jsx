import React, { useEffect } from 'react';
import { FaTimes, FaShoppingCart, FaRuler, FaWeight, FaPalette, FaStar } from 'react-icons/fa';
import { SignInButton } from '@clerk/clerk-react';
import './SareeDetailModal.css';

// Saree specification data pools
const FABRIC_TYPES = ['Pure Silk', 'Banarasi Silk', 'Kanjivaram Silk', 'Organza', 'Georgette', 'Chiffon', 'Cotton Silk', 'Art Silk', 'Tussar Silk', 'Chanderi Silk'];
const WEAVE_PATTERNS = ['Jacquard Weave', 'Brocade Weave', 'Jamdani Weave', 'Ikat Weave', 'Patola Weave', 'Zari Work', 'Kalamkari', 'Bandhani', 'Block Print', 'Digital Print'];
const OCCASIONS = ['Wedding & Bridal', 'Festive & Party', 'Casual Wear', 'Office & Formal', 'Puja & Ceremony', 'Reception', 'Sangeet & Mehendi', 'Daily Wear'];
const BORDER_STYLES = ['Temple Border', 'Zari Border', 'Contrast Border', 'Self Border', 'Floral Border', 'Peacock Motif', 'Paisley Border', 'Geometric Border'];
const PALLU_DESIGNS = ['Grand Pallu', 'Contrast Pallu', 'Embroidered Pallu', 'Self Pallu', 'Zari Pallu', 'Motif Pallu', 'Woven Pallu', 'Printed Pallu'];
const COLORS = ['Crimson Red', 'Royal Blue', 'Emerald Green', 'Deep Maroon', 'Golden Yellow', 'Midnight Black', 'Ivory White', 'Magenta Pink', 'Teal Blue', 'Burnt Orange', 'Lavender Purple', 'Forest Green'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSpecs() {
  const weight = (Math.random() * (1.2 - 0.4) + 0.4).toFixed(1);
  const length = [5.5, 6.0, 6.3, 6.5][Math.floor(Math.random() * 4)];
  const blousePiece = Math.random() > 0.2 ? 'Included (0.8m)' : 'Not Included';
  const rating = (Math.random() * (5.0 - 3.8) + 3.8).toFixed(1);
  const reviews = Math.floor(Math.random() * 500) + 20;

  return {
    fabric: getRandomItem(FABRIC_TYPES),
    weave: getRandomItem(WEAVE_PATTERNS),
    occasion: getRandomItem(OCCASIONS),
    border: getRandomItem(BORDER_STYLES),
    pallu: getRandomItem(PALLU_DESIGNS),
    color: getRandomItem(COLORS),
    weight: `${weight} kg`,
    length: `${length} meters`,
    blousePiece,
    rating: parseFloat(rating),
    reviews,
    washCare: 'Dry Clean Only',
  };
}

function SareeDetailModal({ isOpen, onClose, imageUrl, price, isLoggedIn, onAddToCart }) {
  const [specs] = React.useState(() => generateSpecs());

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatPrice = (value) => {
    if (typeof value !== 'number') return 'Price on request';
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('saree-modal-backdrop')) {
      onClose();
    }
  };

  const handleAddToCartClick = () => {
    onAddToCart({ imageUrl, price });
    onClose();
  };

  return (
    <div className="saree-modal-backdrop" onClick={handleBackdropClick}>
      <div className="saree-modal-container">
        {/* Close Button */}
        <button className="saree-modal-close" onClick={onClose} aria-label="Close modal">
          <FaTimes />
        </button>

        {/* Image Side */}
        <div className="saree-modal-image-section">
          <img src={imageUrl} alt="Saree Design" className="saree-modal-image" />
          <div className="saree-modal-image-badge">AI Generated</div>
        </div>

        {/* Details Side */}
        <div className="saree-modal-details-section">
          <div className="saree-modal-header">
            <h2 className="saree-modal-title">{specs.fabric} Saree</h2>
            <div className="saree-modal-rating">
              <FaStar className="star-icon" />
              <span>{specs.rating}</span>
              <span className="review-count">({specs.reviews} reviews)</span>
            </div>
          </div>

          <div className="saree-modal-price-block">
            <span className="saree-modal-price">{formatPrice(price)}</span>
            <span className="saree-modal-mrp">MRP {formatPrice(Math.floor(price * 1.4))}</span>
            <span className="saree-modal-discount">40% OFF</span>
          </div>

          <p className="saree-modal-tagline">
            Exquisite {specs.weave.toLowerCase()} craftsmanship with {specs.border.toLowerCase()} detailing. 
            Perfect for {specs.occasion.toLowerCase()} events.
          </p>

          {/* Specs Grid */}
          <div className="saree-modal-specs-grid">
            <div className="spec-item">
              <span className="spec-label"><FaPalette /> Fabric</span>
              <span className="spec-value">{specs.fabric}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label"><FaPalette /> Color</span>
              <span className="spec-value">{specs.color}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label"><FaRuler /> Length</span>
              <span className="spec-value">{specs.length}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label"><FaWeight /> Weight</span>
              <span className="spec-value">{specs.weight}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">🧵 Weave</span>
              <span className="spec-value">{specs.weave}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">🎀 Border</span>
              <span className="spec-value">{specs.border}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">✨ Pallu</span>
              <span className="spec-value">{specs.pallu}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">👗 Blouse</span>
              <span className="spec-value">{specs.blousePiece}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">🎉 Occasion</span>
              <span className="spec-value">{specs.occasion}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">🧼 Care</span>
              <span className="spec-value">{specs.washCare}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="saree-modal-actions">
            {isLoggedIn ? (
              <button className="saree-modal-cart-btn" onClick={handleAddToCartClick}>
                <FaShoppingCart /> Add to Cart
              </button>
            ) : (
              <SignInButton mode="modal" afterSignInUrl="/" afterSignUpUrl="/">
                <button className="saree-modal-cart-btn">
                  <FaShoppingCart /> Sign In & Add to Cart
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SareeDetailModal;

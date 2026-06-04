import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchPage from './pages/SearchPage';
import { useUser } from '@clerk/clerk-react';
import CartDrawer from './components/CartDrawer';
import './components/Footer.css'; 

const API_URL = 'http://localhost:5001';

function App() {
  // 1. Cart is now just a local array, not fetched from DB
  const [cartItems, setCartItems] = useState([]);
  const { isSignedIn, isLoaded, user } = useUser(); 
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 2. Add to Cart: Update local state only
  const handleAddToCart = (item) => {
    // Create a temporary item object
    const newItem = {
      _id: Date.now().toString(), // Generate a temporary ID
      imageUrl: item?.imageUrl,
      price: item?.price
    };
    setCartItems(prev => [...prev, newItem]);
    setIsCartOpen(true);
  };

  // 3. Remove from Cart: Update local state only
  const handleRemoveFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item._id !== itemId));
  };

  // 4. PLACE ORDER: This is the ONLY time we talk to the database
  const handlePlaceOrder = async (formData) => {
    if (!user) return;

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: cartItems, // Send all items
          userDetails: formData // Send the address form data
        })
      });

      if (response.ok) {
        // Success! Clear the local cart
        setCartItems([]);
      } else {
        console.error("Failed to place order");
      }
    } catch (err) {
      console.error("Error connecting to server:", err);
    }
  };

  if (!isLoaded) {
    return <div className="loading-message">Loading...</div>;
  }

  return (
    <div>
      <Navbar 
        cartItemCount={cartItems.length}
        onClearCart={() => setCartItems([])} 
        onCartClick={() => setIsCartOpen(true)} 
      /> 
      
      <Routes>
        <Route 
          path="/" 
          element={
            <SearchPage 
              isLoggedIn={isSignedIn} 
              onAddToCart={handleAddToCart}
              userId={user?.id}
            />
          } 
        /> 
        <Route 
          path="/search" 
          element={
            <SearchPage 
              isLoggedIn={isSignedIn}
              onAddToCart={handleAddToCart}
              userId={user?.id}
            />
          } 
        />
      </Routes>
      
      <CartDrawer 
        isCartOpen={isCartOpen}
        onCartClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        isLoggedIn={isSignedIn}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handlePlaceOrder} // Pass the new function
      />

      <footer className="dark-footer">
        <div className="footer-grid">
            {/* ... footer content remains the same ... */}
            {/* (Keeping the footer content short here to save space, 
                 but your existing footer code goes here) */}
            <div className="footer-column logo-column">
            <h3 className="footer-logo-dark">PyThani.ai</h3>
            <p>Experience the power of AI...</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App;
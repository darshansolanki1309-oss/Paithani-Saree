import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js'; 
// Note: We removed CartItem import since we aren't using it for the new logic, 
// but you can keep it if you want.

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// --- 1. MIDDLEWARE ---
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// --- 2. MONGODB CONNECTION ---
const MONGO_URI = "mongodb://localhost:27017/pythaniDB";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB!"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// --- 3. ROUTES ---
app.get('/', (req, res) => {
  res.send('Hello from the PyThani Server!');
});

// POST: Create a new Order
app.post('/api/orders', async (req, res) => {
  console.log("Received order request..."); 

  try {
    const { userId, items, userDetails } = req.body;

    if (!userId || !items || items.length === 0) {
      console.error("Validation Failed: Missing data");
      return res.status(400).json({ message: 'Invalid order data' });
    }

    console.log(`Processing order for User: ${userId} with ${items.length} items.`);

    // --- FIX IS HERE ---
    // We create a NEW array that ONLY contains the imageUrl.
    // We purposefully IGNORE the '_id' sent from the frontend.
    const cleanedItems = items.map(item => ({
      imageUrl: item.imageUrl
    }));
    // -------------------

    const newOrder = new Order({
      userId,
      items: cleanedItems, // Send the cleaned items
      userDetails, 
    });
    
    const savedOrder = await newOrder.save();
    console.log("SUCCESS: Order saved with ID:", savedOrder._id);
    res.status(201).json(savedOrder);

  } catch (error) {
    console.error("DATABASE ERROR:", error.message);
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
});

// GET: Fetch all orders (For Admin Panel)
app.get('/api/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// GET: Fetch stats (For Admin Panel)
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const salesData = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } }
    ]);
    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;
    const processingOrders = await Order.countDocuments({ status: 'Processing' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });

    res.status(200).json({
      totalOrders,
      totalSales,
      processingOrders,
      deliveredOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// --- 4. GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error("SERVER CRASHED:", err.message);
  res.status(500).send('Something broke!');
});


// --- NEW: UPDATE ORDER STATUS (Admin Action) ---
app.patch('/api/admin/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Accepted' or 'Cancelled'

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: status },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
});

// --- 5. START SERVER ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
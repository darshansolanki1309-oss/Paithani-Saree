import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      imageUrl: { type: String, required: true }
    }
  ],
  // New field to store the address form data
  userDetails: {
    firstName: String,
    lastName: String,
    mobile: String,
    address: String,
    paymentMethod: String,
  },
  status: {
    type: String,
    default: 'Processing',
    enum: ['Processing', 'Accepted', 'Cancelled', 'Delivered'],
  },
  createdAt: {
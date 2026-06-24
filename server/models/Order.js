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
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;

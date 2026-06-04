import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// This creates the model and names the collection "cartitems" in MongoDB
const CartItem = mongoose.model('CartItem', cartItemSchema);

export default CartItem;
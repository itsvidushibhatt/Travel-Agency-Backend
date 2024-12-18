const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'TourPackage', required: true }, // Fixed ref name
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  travelers: { type: Number, required: true },
  specialRequests: { type: String },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);

const mongoose = require('mongoose');

const TourPackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: String, required: true }, // Add tour date (e.g., "2024-06-15")
  time: { type: String, required: true }, // Add tour time (e.g., "10:00 AM")
  image: { type: String, required: true }
});

module.exports = mongoose.model('TourPackage', TourPackageSchema);

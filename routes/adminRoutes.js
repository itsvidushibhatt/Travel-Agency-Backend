const express = require('express');
const router = express.Router();
const Package = require('../models/TourPackage');
const Booking = require('../models/Booking');

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('packageId');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Add a new package
router.post('/packages', async (req, res) => {
  const { title, description, price, image, date, time } = req.body;

  // Validate fields
  if (!title || !description || !price || !image || !date || !time) {
    return res
      .status(400)
      .json({ message: 'All fields (title, description, price, image, date, and time) are required.' });
  }

  try {
    const newPackage = new Package({
      title,
      description,
      price: Number(price), // Ensure price is a number
      image,
      date,
      time,
    });

    const savedPackage = await newPackage.save();
    console.log('Package added successfully:', savedPackage);
    res.status(201).json(savedPackage);
  } catch (error) {
    console.error('Error adding package:', error.message);
    res.status(500).json({ message: 'Error adding package', error: error.message });
  }
});

// Update a package
router.put('/packages/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, price, image, date, time } = req.body;

  // Validate fields
  if (!title || !description || !price || !image || !date || !time) {
    return res
      .status(400)
      .json({ message: 'All fields (title, description, price, image, date, and time) are required.' });
  }

  try {
    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { title, description, price: Number(price), image, date, time },
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ message: 'Package not found.' });
    }

    console.log('Package updated successfully:', updatedPackage);
    res.json(updatedPackage);
  } catch (error) {
    console.error('Error updating package:', error.message);
    res.status(500).json({ message: 'Error updating package', error: error.message });
  }
});

// Delete a package
router.delete('/packages/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPackage = await Package.findByIdAndDelete(id);

    if (!deletedPackage) {
      return res.status(404).json({ message: 'Package not found.' });
    }

    console.log('Package deleted successfully:', deletedPackage);
    res.json({ message: 'Package deleted successfully.', deletedPackage });
  } catch (error) {
    console.error('Error deleting package:', error.message);
    res.status(500).json({ message: 'Error deleting package', error: error.message });
  }
});

module.exports = router;

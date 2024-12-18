const express = require('express');
const { bookPackage } = require('../controllers/bookingController');
const router = express.Router();

router.post('/', bookPackage);

module.exports = router;
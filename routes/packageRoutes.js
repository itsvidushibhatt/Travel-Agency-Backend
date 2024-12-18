const express = require('express');
const {
    getPackages,
    getPackageById,
    addPackage,
    updatePackage,
    deletePackage,
    generateInvoice,
} = require('../controllers/packageController');

const router = express.Router();

router.get('/', getPackages);
router.get('/:id', getPackageById);
router.post('/admin', addPackage);
router.put('/admin/:id', updatePackage);
router.delete('/admin/:id', deletePackage);

// New route for invoice generation
router.post('/invoice', generateInvoice);

module.exports = router;

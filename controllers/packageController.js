const TourPackage = require('../models/TourPackage');
const pdf = require('html-pdf'); // For PDF generation

// Helper: Validate required fields for a Tour Package
const validatePackageFields = ({ title, description, price, image, date, time }) => {
    if (!title || !description || !price || !image || !date || !time) {
        return 'All fields (title, description, price, image, date, and time) are required.';
    }
    if (isNaN(price) || price <= 0) {
        return 'Price must be a valid positive number.';
    }
    return null;
};

// Get all packages
exports.getPackages = async (req, res) => {
    try {
        console.log('Fetching all packages...');
        const packages = await TourPackage.find();
        res.status(200).json(packages);
    } catch (error) {
        console.error('Error fetching packages:', error.message);
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// Get a package by ID
exports.getPackageById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Fetching package with ID:', id);
        const pkg = await TourPackage.findById(id);

        if (!pkg) {
            console.log('Package not found');
            return res.status(404).json({ error: 'Package not found' });
        }

        res.status(200).json(pkg);
    } catch (error) {
        console.error('Error fetching package:', error.message);
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// Add a new package
exports.addPackage = async (req, res) => {
    const { title, description, price, image, date, time } = req.body;

    try {
        const validationError = validatePackageFields({ title, description, price, image, date, time });
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const newPackage = new TourPackage({
            title,
            description,
            price: Number(price),
            image,
            date,
            time,
        });

        const savedPackage = await newPackage.save();
        console.log('New package added successfully:', savedPackage);
        res.status(201).json({ message: 'Package added successfully', package: savedPackage });
    } catch (error) {
        console.error('Error adding package:', error.message);
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// Update a package
exports.updatePackage = async (req, res) => {
    const { title, description, price, image, date, time } = req.body;

    try {
        const validationError = validatePackageFields({ title, description, price, image, date, time });
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const { id } = req.params;
        const updatedPackage = await TourPackage.findByIdAndUpdate(
            id,
            { title, description, price: Number(price), image, date, time },
            { new: true, runValidators: true }
        );

        if (!updatedPackage) {
            console.log('Package not found');
            return res.status(404).json({ error: 'Package not found' });
        }

        console.log('Package updated successfully:', updatedPackage);
        res.status(200).json({ message: 'Package updated successfully', package: updatedPackage });
    } catch (error) {
        console.error('Error updating package:', error.message);
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// Delete a package
exports.deletePackage = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Deleting package with ID:', id);
        const deletedPackage = await TourPackage.findByIdAndDelete(id);

        if (!deletedPackage) {
            console.log('Package not found');
            return res.status(404).json({ error: 'Package not found' });
        }

        console.log('Package deleted successfully:', deletedPackage);
        res.status(200).json({ message: 'Package deleted successfully', package: deletedPackage });
    } catch (error) {
        console.error('Error deleting package:', error.message);
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// Generate Invoice
exports.generateInvoice = async (req, res) => {
    try {
        console.log('Received Invoice Request:', req.body);

        const { name, email, phone, travelers, packageDetails } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !travelers || !packageDetails || !packageDetails.title || !packageDetails.price || !packageDetails.date || !packageDetails.time) {
            console.log('Validation Error: Missing required fields');
            return res.status(400).json({ error: 'All customer and package details are required.' });
        }

        const { title, price, date, time } = packageDetails;
        const totalPrice = travelers * price;

        // HTML Invoice Template
        const invoiceHtml = `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .invoice-container { border: 1px solid #ddd; padding: 20px; border-radius: 10px; }
                h1 { color: #333; }
                table { width: 100%; margin-top: 20px; border-collapse: collapse; }
                table, th, td { border: 1px solid #ddd; text-align: left; }
                th, td { padding: 8px; }
                .total { font-weight: bold; color: green; }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <h1>Travel Package Invoice</h1>
                <p><strong>Customer Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <h3>Package Details</h3>
                <table>
                    <tr>
                        <th>Package</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Price per Person</th>
                        <th>Number of Travelers</th>
                        <th>Total Price</th>
                    </tr>
                    <tr>
                        <td>${title}</td>
                        <td>${date}</td>
                        <td>${time}</td>
                        <td>$${price}</td>
                        <td>${travelers}</td>
                        <td class="total">$${totalPrice}</td>
                    </tr>
                </table>
            </div>
        </body>
        </html>
        `;

        console.log('Generating PDF invoice...');
        pdf.create(invoiceHtml).toStream((err, stream) => {
            if (err) {
                console.error('Error generating invoice:', err.message);
                return res.status(500).json({ error: 'Failed to generate invoice' });
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
            stream.pipe(res);
        });
    } catch (error) {
        console.error('Error generating invoice:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

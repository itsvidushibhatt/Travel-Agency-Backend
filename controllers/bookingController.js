const Booking = require('../models/Booking');
const TourPackage = require('../models/TourPackage');

exports.bookPackage = async (req, res) => {
    try {
        const { name, email, phone, travelers, packageId, specialRequests } = req.body;

        // 1. Validate the package existence
        const tourPackage = await TourPackage.findById(packageId);
        if (!tourPackage) return res.status(404).json({ error: 'Package not found' });

        // 2. Calculate total price
        const totalPrice = travelers * tourPackage.price;

        // 3. Create a new booking
        const newBooking = new Booking({
            name,
            email,
            phone,
            travelers,
            specialRequests, // Optional field
            packageId, // Fixed to match schema
            totalPrice,
        });

        // Save booking to database
        await newBooking.save();

        // 4. Prepare invoice details
        const invoice = {
            customer: {
                name,
                email,
                phone,
            },
            package: {
                title: tourPackage.title,
                pricePerPerson: tourPackage.price,
            },
            travelers,
            totalPrice,
            specialRequests: specialRequests || 'N/A',
        };

        // 5. Send response with booking details and invoice
        res.status(201).json({
            message: 'Booking successful',
            booking: newBooking,
            invoice,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

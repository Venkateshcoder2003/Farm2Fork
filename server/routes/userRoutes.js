
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Issue = require('../models/Issue')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const authMiddleware = require('../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Existing code from previous implementation...

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

function formatIndianPhoneNumber(number) {
    // Remove any non-digit characters
    const cleaned = number.replace(/\D/g, '');

    // Check if the number already has the country code
    if (cleaned.startsWith('91') && cleaned.length === 12) {
        return '+' + cleaned;
    }

    // If it's a 10-digit number, add the country code
    if (cleaned.length === 10) {
        return '+91' + cleaned;
    }

    // If it doesn't match expected formats, return as is (Twilio will validate)
    return number;
}

async function generateAndSendPIN(mobileNumber, message) {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const formattedNumber = formatIndianPhoneNumber(mobileNumber);

    try {
        const twilioMessage = await client.messages.create({
            body: `${message} ${pin}`,
            from: twilioPhoneNumber,
            to: formattedNumber
        });

        console.log('Twilio message SID:', twilioMessage.sid);
        return pin;
    } catch (error) {
        console.error('Error sending PIN:', error);
        throw error;
    }
}

router.get('/name/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ name: user.name });
    } catch (error) {
        console.error('Error fetching user name:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/send-pin', async (req, res) => {
    const { mobileNumber } = req.body;

    try {
        const pin = await generateAndSendPIN(mobileNumber, 'Your Farm2Fork PIN is:');
        res.status(200).json({ message: 'PIN sent successfully' });
    } catch (error) {
        console.error('Error sending PIN:', error);
        res.status(500).json({
            message: 'Failed to send PIN',
            error: error.message,
            code: error.code,
            moreInfo: error.moreInfo
        });
    }
});

router.post('/forgot-pin', async (req, res) => {
    const { mobileNumber } = req.body;

    try {
        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newPin = await generateAndSendPIN(mobileNumber, 'Your new Farm Unity PIN is:');
        const hashedPin = await bcrypt.hash(newPin, 10);

        user.pin = hashedPin;
        await user.save();

        res.status(200).json({ message: 'New PIN sent successfully' });
    } catch (error) {
        console.error('Error in forgot PIN process:', error);
        res.status(500).json({
            message: 'Failed to process forgot PIN request',
            error: error.message,
            code: error.code,
            moreInfo: error.moreInfo
        });
    }
});


// Update registration route to include role
router.post('/register', async (req, res) => {
    try {
        console.log("Request Came to server: ", req.body)
        const { name, mobileNumber, aadharNumber, pin, role } = req.body;

        if (!['farmer', 'distributor', 'consumer', 'serviceProvider'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        // Validate user input data
        if (!name || !mobileNumber || !aadharNumber || !pin || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ mobileNumber }, { aadharNumber }]
        });
        if (existingUser) {
            return res.status(400).json({
                message: 'User with this mobile number or Aadhaar number already exists'
            });
        }

        // Validate PIN
        if (pin.length !== 6 || !/^\d+$/.test(pin)) {
            return res.status(400).json({ message: 'PIN must be 6 digits' });
        }

        // Hash PIN
        const hashedPin = await bcrypt.hash(pin, 10);

        // Create new user
        const newUser = new User({
            name,
            mobileNumber,
            aadharNumber,
            pin: hashedPin,
            role
        });

        // Save new user to database
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            userId: newUser._id,
            token,
            role: newUser.role
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { mobileNumber, pin } = req.body;
        const user = await User.findOne({ mobileNumber });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(pin, user.pin);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Determine dashboard route based on role
        let dashboardRoute;
        switch (user.role) {
            case 'farmer':
                dashboardRoute = '/farmer-dashboard';
                break;
            case 'distributor':
                dashboardRoute = '/distributor-dashboard';
                break;
            case 'consumer':
                dashboardRoute = '/consumer-dashboard';
                break;
            case 'serviceProvider':
                dashboardRoute = '/service-provider-dashboard';
                break;
            default:
                dashboardRoute = '/unauthorized';
        }

        res.status(200).json({
            message: 'Login successful',
            userId: user._id,
            token,
            role: user.role,
            name: user.name,
            dashboardRoute
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});
// Protected route example
router.get('/profile', authMiddleware, async (req, res) => {
    res.json(req.user);
});


router.post('/issues', async (req, res) => {
    try {
        const { username, productName, issueDescription, issueType } = req.body;

        console.log("Issue In Backend: ", req.body);

        // Validate input
        if (!productName || !issueDescription || !issueType) {
            return res.status(400).json({ message: 'Product name, issue type, and issue description are required' });
        }

        // Create new issue
        const newIssue = new Issue({
            user: username,  // Use the authenticated user's ID
            productName,
            issueType,
            issueDescription
        });

        // Save the issue
        await newIssue.save();

        res.status(201).json({
            message: 'Issue reported successfully',
            issue: newIssue
        });
    } catch (error) {
        console.error('Error creating issue:', error);
        res.status(500).json({
            message: 'Error reporting issue',
            error: error.message
        });
    }
});
// Get all issues route
router.get('/issues', async (req, res) => {
    try {
        // Fetch all issues, sorted by most recent first
        const issues = await Issue.find().sort({ createdAt: -1 });
        res.status(200).json(issues);
    } catch (error) {
        console.error('Error fetching issues:', error);
        res.status(500).json({
            message: 'Error retrieving issues',
            error: error.message
        });
    }
});

module.exports = router;
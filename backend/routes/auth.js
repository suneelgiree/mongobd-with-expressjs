const router = require('express').Router();// Import the express router
const User = require('../models/User');// Import the User model
const { check, validationResult } = require('express-validator');// Import the express-validator
const bcrypt = require('bcryptjs');// Import bcrypt
const jwt = require('jsonwebtoken');// Import jsonwebtoken
const fetchuser = require('../middleware/fetchuser');// Import fetchuser middleware

const JWT_SECRET = 'shhhhh';// Define the JWT secret

// Route:1 Create a new user using : Post /api/auth/createuser
router.post('/createuser', [
    check('name', 'Please enter a valid name').not().isEmpty(),// Validate the name
    check('email', 'Please enter a valid email').isEmail(),// Validate the email
    check('password', 'Please enter a valid password').isLength({ min: 6 }),// Validate the password
], async (req, res) => {
    const errors = validationResult(req);// Check if there are any validation errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });// Return the validation errors
    }

    if (!req.body) {
        return res.status(400).json({ msg: 'Request body is required' });// Check if the request body is empty
    }

    try {
        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email already exists' });// Return an error if the email already exists
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
        // Create a new user
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,// Save the hashed password
        });
        
        // Create a JWT
        const jwtData = jwt.sign(
            {
                user: {
                    id: user._id,
                },
            },
            JWT_SECRET 
        );

        res.status(201).json({ jwtData }); // Return JWT and indicate user creation success
    } catch (error) {
        // Handle any other error that occurs during user creation
        console.error('Error creating user:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Route:2 Authenticate a user using : Post /api/auth/login . No login page is required.
router.post('/login', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a valid password').isLength({ min: 6 }),
], async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ msg: 'Request body is required' });// Check if the request body is empty
    }
    // Validate the email and password
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });// Check if there are any validation errors
    }

    try {
        // Check if the email exists in the database
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check if the password is correct
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const jwtData = jwt.sign(// Create a JWT
            {
                user: {
                    id: user._id,
                },
            },
            JWT_SECRET 
        );

        res.status(200).json({ jwtData }); // Return JWT and indicate login success
    } catch (error) {
        // Handle any other error that occurs during login
        console.error('Error logging in:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});
module.exports = router;// Export the router

// Route:3 Get logged in user details using : Post /api/auth/getuser . This route should return the user details after logging in.
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

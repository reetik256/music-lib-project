const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// Register User
// Register a User:

// Method: POST
// URL: http://localhost:5000/api/auth/register
// Body (JSON):
// {
//   "name": "John Doe",
//   "email": "john@example.com",
//   "password": "password123",
//   "role": "user" // or "admin"
// }
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            role: role || 'user' // Default role is 'user'
        });

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send('Server error');
                }
                // Sending both the token and a success message
                res.status(200).json({
                    message: 'Registration successful',
                    token: token
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
// Login User
// Login:

// Method: POST
// URL: http://localhost:5000/api/auth/login
// Body (JSON):
// {
//   "email": "john@example.com",
//   "password": "password123"
// }
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send('Server error');
                }
                // Sending both the token and a success message
                res.status(200).json({
                    message: 'Login Success',
                    token: token
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
// Get User Information
// Get Current User:

// Method: GET
// URL: http://localhost:5000/api/auth/me
// Headers:
// Authorization: Bearer <your_jwt_token>
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
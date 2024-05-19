const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
// Secret Key
const secret = process.env.JWT_SECRET;

// Registration Route
router.post('/register', async (req, res) => {
    try {
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashPassword = await bcrypt.hash(req.body.password, 10);
        // Create new User
        const newUser = new User({
            username: req.body.username,
            email:req.body.email,
            password: hashPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User Registration Successful' });
    } catch (err) {
        console.error('Error in Registering User', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ message: 'Username or Password Invalid' });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Username or Password Invalid' });
        }

        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1hr' });
        username=req.body.username;
        res.status(200).json({ token,username });
    } catch (err) {
        console.error('Error in Login', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Auth Middleware
router.use('/auth', async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decodedToken = jwt.verify(token, secret);
        req.userData = { userId: decodedToken.userId };
        console.log(decodedToken,req.userData);
        next();
    } catch (err) {
        console.error('Error in Decoding Token', err);
        res.status(401).json({ message: 'Unauthorized' });
    }
});

// Protected Endpoint
router.get('/protected-endpoint', (req, res) => {
    res.status(200).json({ message: 'Protected Endpoint Accessed Successfully' });
});


module.exports = router;

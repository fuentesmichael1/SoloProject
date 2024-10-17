import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        console.log('Registration data:', { firstName, lastName, email });
        
        const newUser = new User({ firstName, lastName, email, password });
        await newUser.save();
        
        console.log('New user created:', newUser);
        
        const token = generateToken(newUser._id);
        res.status(201).json({ message: "User registered successfully", token, user: { firstName: newUser.firstName, email: newUser.email } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ message: "Registration failed", error: error.message });
    }
};

export const loginUser = async (req, res) => {
    console.log('Login attempt:', req.body);
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email });
        console.log('User found:', user);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = generateToken(user._id);
        console.log('Token generated:', token);
        res.json({ message: "Logged in successfully", token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};

export const logoutUser = (req, res) => {
    localStorage.removeItem('token');
    Navigation('/login');
    res.json({ message: "Logged out successfully" });
};

export const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        console.log('JWT_SECRET used for verification:', process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const getCurrentUser = async (req, res) => {
    console.log('getCurrentUser called, user id:', req.user.id);
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

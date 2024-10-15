import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        console.log('Registration data:', { firstName, lastName, email });
        
        const newUser = new User({ firstName, lastName, email, password });
        await newUser.save();
        
        console.log('New user created:', newUser);
        
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '60h' });
        res.status(201).json({ message: "User registered successfully", token, user: { firstName: newUser.firstName, email: newUser.email } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ message: "Registration failed", error: error.message });
    }
};



export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '60h' });
        res.json({ message: "Logged in successfully", token, userName: user.name });
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
        console.log('Received token:', token);
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('firstName email');
        console.log('User found:', user);
        res.json(user);
    } catch (error) {
        console.error('Error in getCurrentUser:', error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
};

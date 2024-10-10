import Chore from '../models/chores.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const validateChore = async (req, res) => {
    const chore = new Chore(req.body);
    try {
        await chore.validate();
        res.json({ message: 'Chore is valid' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllChores = async (req, res) => {
    try {
        const chores = await Chore.find();
        res.json(chores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createChore = async (req, res) => {
    const chore = new Chore(req.body);
    try {
        const savedChore = await chore.save();
        res.status(201).json(savedChore);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getOneChore = async (req, res) => {
    try {
        const chore = await Chore.findById(req.params.id);
        if (!chore) return res.status(404).json({ message: 'Chore not found' });
        res.json(chore);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateChore = async (req, res) => {
    try {
        const updatedChore = await Chore.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedChore) return res.status(404).json({ message: 'Chore not found' });
        res.json(updatedChore);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteChore = async (req, res) => {
    try {
        const deletedChore = await Chore.findByIdAndDelete(req.params.id);
        if (!deletedChore) return res.status(404).json({ message: 'Chore not found' });
        res.json({ message: 'Chore deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const assignChore = async (req, res) => {
    try {
        const chore = await Chore.findById(req.params.id);
        if (!chore) return res.status(404).json({ message: 'Chore not found' });
        chore.assignedTo = req.body.userId;
        const updatedChore = await chore.save();
        res.json(updatedChore);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getUserChores = async (req, res) => {
    try {
        const userChores = await Chore.find({ assignedTo: req.params.userId });
        res.json(userChores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        console.error('Error in getCurrentUser:', error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
};

export const logoutUser = async (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

export const registerUser = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        console.log('Registration attempt:', { email, password: '****', confirmPassword: '****' });
        
        if (password !== confirmPassword) {
            return res.status(400).json({ register: "Passwords don't match" });
        }

        const existingUser = await Chore.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ register: "Email already in use" });
        }

        const newUser = new Chore({ 
            email, 
            password,
            name: 'New User',
            description: 'New user account',
            location: 'Default Location'
        });

        await newUser.save();
        console.log('User registered successfully:', newUser);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ register: "Registration failed", error: error.message });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email, password: '****' });

        const user = await Chore.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ login: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(400).json({ login: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        console.log('Login successful:', { id: user._id, email: user.email });
        res.json({ message: "Logged in successfully", user: { id: user._id, email: user.email } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ login: "Login failed", error: error.message });
    }
};
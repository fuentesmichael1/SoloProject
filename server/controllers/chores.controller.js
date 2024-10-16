import Chore from '../models/chores.model.js';

export const createChore = async (req, res) => {
    try {
        console.log('Received chore data:', req.body);
        console.log('User from request:', req.user);
        const { name, description, location } = req.body;
        const newChore = new Chore({
            name,
            description,
            location,
            postedBy: req.user.id
        });
        console.log('New chore object:', newChore);
        await newChore.save();
        res.status(201).json(newChore);
    } catch (error) {
        console.error('Error creating chore:', error);
        res.status(400).json({ message: error.message });
    }
};

export const getAllChores = async (req, res) => {
    try {
        const chores = await Chore.find().populate('postedBy', 'firstName');
        res.json(chores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOneChore = async (req, res) => {
    try {
        console.log('Fetching chore with ID:', req.params.id);
        const chore = await Chore.findById(req.params.id).populate('postedBy', 'firstName');
        console.log('Chore found:', chore);
        if (!chore) return res.status(404).json({ message: 'Chore not found' });
        res.json(chore);
    } catch (error) {
        console.error('Error in getOneChore:', error);
        res.status(500).json({ message: error.message });
    }
};


export const updateChore = async (req, res) => {
    try {
        const updatedChore = await Chore.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedChore);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteChore = async (req, res) => {
    try {
        await Chore.findByIdAndDelete(req.params.id);
        res.json({ message: 'Chore deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const assignChore = async (req, res) => {
    try {
        const chore = await Chore.findByIdAndUpdate(
            req.params.id, 
            { assignedTo: req.user._id },
            { new: true }
        ).populate('assignedTo', 'firstName');
        
        if (!chore) {
            return res.status(404).json({ message: 'Chore not found' });
        }
        res.json(chore);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
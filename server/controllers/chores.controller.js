import Chore from '../models/chores.model.js';

export const createChore = async (req, res) => {
    try {
        const chore = new Chore(req.body);
        await chore.save();
        res.json(chore);
    } catch (err) {
        res.status(400).json(err);
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
        const updatedChore = await Chore.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedChore) return res.status(404).json({ message: 'Chore not found' });
        res.json(updatedChore);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteChore = async (req, res) => {
    try {
        const chore = await Chore.findByIdAndDelete(req.params.id);
        if (!chore) return res.status(404).json({ message: 'Chore not found' });
        res.json({ message: 'Chore deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
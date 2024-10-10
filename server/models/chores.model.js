import mongoose from 'mongoose';

const ChoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Chore name is required'],
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [40, 'Name cannot exceed 40 characters']
    },
    description: {
        type: String,
        required: [true, 'Chore description is required'],
        minlength: [10, 'Description must be at least 10 characters long']
    },
    location: {
        type: String,
        required: [true, 'Chore location is required'],
        minlength: [1, 'Location must be at least 1 character long']
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    assignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    status: { 
        type: String, 
        enum: ['pending', 'completed'], 
        default: 'pending' 
    },
    completed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Chore = mongoose.model('Chore', ChoreSchema);

export default Chore;
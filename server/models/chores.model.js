import mongoose from 'mongoose';

const choreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Chore name is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Chore = mongoose.model('Chore', choreSchema);

export default Chore;

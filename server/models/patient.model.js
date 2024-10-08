import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Patient name is required'],
        minlength: [2, 'Name must be at least 2 character long'],
        maxlength: [40, 'Name cannot exceed 40 characters']
    },
    age: {
        type: Number,
        required: [true, 'Patient age is required'],
        min: [1, 'Age must be at least 1'],
        max: [140, 'Age cannot exceed 140']
    },
    symptoms: {
        type: String,
        required: [true, 'Patient symptoms are required'],
        minlength: [4, 'Symptoms must be at least 4 characters long']
    }
}, { timestamps: true });

const Patient = mongoose.model('Patient', PatientSchema);
export default Patient;
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from './config/mongoose.config.js';
import patientRoutes from './routes/patient.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json(), cors());
app.use('/api', patientRoutes);

dbConnect();

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
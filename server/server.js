import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import dbConnect from './config/mongoose.config.js';
import choreRoutes from './routes/chore.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/api/users', userRoutes);
app.use('/api', choreRoutes);

dbConnect();

app.listen(PORT, () => {
    console.log(`Chore management server listening on port ${PORT}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.toString() });
});
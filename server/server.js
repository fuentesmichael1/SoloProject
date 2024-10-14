import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from './config/mongoose.config.js';
import userRoutes from './routes/user.routes.js';
import choreRoutes from './routes/chores.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json()), (cors());
app.use('/users', userRoutes);
app.use('/api', choreRoutes);

dbConnect();

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from './config/mongoose.config.js';
import userRoutes from './routes/user.routes.js';
import choreRoutes from './routes/chores.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use('/users', userRoutes);
app.use('/api', choreRoutes);

console.log('Routes set up:', app._router.stack.filter(r => r.route).map(r => r.route.path));

dbConnect();

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

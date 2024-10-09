import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from './config/mongoose.config.js';
import choreRoutes from './routes/chores.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json(), cors());
app.use('/api', choreRoutes);

dbConnect();

app.listen(PORT, () => {
    console.log(`Chore management server listening on port ${PORT}`);
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ message: 'Something went wrong!' });
    });

});

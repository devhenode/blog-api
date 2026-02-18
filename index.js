import 'dotenv/config';
import express from "express";
import "./config/db.js";
import authRoutes from './routes/authroutes.js';
import blogRoutes from './routes/blogroutes.js';


const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to Henry O. (devhenode) Blog API!");
});

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    if (err.code === 11000) {
        return res.status(400).json({
            status: 'fail',
            message: 'Duplicate value detected. Email or Title already exists.'
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ status: 'fail', message: 'Invalid token' });
    }

    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
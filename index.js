import dotenv from "dotenv";
import express from "express";
import "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Blog API!");
});

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
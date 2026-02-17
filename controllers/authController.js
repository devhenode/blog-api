import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from "bcrypt";

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });
};

export const signup = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
    });

    newUser.password = undefined;
    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: { user: newUser },
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
    }

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token,
    });
};
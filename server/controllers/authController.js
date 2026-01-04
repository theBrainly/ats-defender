import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Create token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.ACCESS_SECERT_TOKEN,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, user: { id: newUser._id, name, email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export /**
 * Active: 2026-01-02
 * Function: login
 */
/**
 * Active: 2026-01-04
 * Function: login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESS_SECERT_TOKEN,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
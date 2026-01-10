import User from '../models/User.js';

export /**
 * Active: 2026-01-02
 * Function: getUserProfile
 */
/**
 * Active: 2026-01-03
 * Function: getUserProfile
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export /**
 * Active: 2026-01-10
 * Function: updateUserProfile
 */
const updateUserProfile = async (req, res) => {
  try {
    const { name } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.name = name || user.name;
    
    const updatedUser = await user.save();
    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
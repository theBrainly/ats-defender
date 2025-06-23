import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
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

export const updateUserProfile = async (req, res) => {
  try {
    const { username } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.username = username || user.username;
    
    const updatedUser = await user.save();
    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
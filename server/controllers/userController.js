const User = require('../models/User');

const getAllUsers = async (_req, res, next) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllUsers
};

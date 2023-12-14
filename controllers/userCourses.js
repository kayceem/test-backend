const mongoose = require('mongoose');
const Order = require('../models/Order');
const Course = require('../models/Course');
const Wishlist = require('../models/Wishlist');

exports.getCoursesByUser = async (req, res, next) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    const userOrders = await Order.find({ 'user._id': userId });
    console.log(userOrders);
    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng cho người dùng này.' });
    }

    const courseIds = userOrders[0].items.map(item => item._id);

    const courses = await Course.find({ "_id": { $in: courseIds } })
      .populate("categoryId", "_id name")
      .populate("userId", "_id name avatar");

    res.status(200).json({
      message: "Fetch Courses by User successfully!",
      courses: courses,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCoursesWishlistByUser = async (req, res, next) => {
    const { userId } = req.params;
    console.log(userId);
    try {
      const userWishlists = await Wishlist.find({ 'user._id': userId });
      console.log(userWishlists);
      if (!userWishlists || userWishlists.length === 0) {
        return res.status(404).json({ error: 'Không tìm thấy đơn hàng cho người dùng này.' });
      }
  
      const courseIds = userWishlists[0].items.map(item => item._id);
  
      const courses = await Course.find({ "_id": { $in: courseIds } })
        .populate("categoryId", "_id name")
        .populate("userId", "_id name avatar");
      res.status(200).json({
        message: "Fetch Courses by User successfully!",
        courses: courses,
      });
    } catch (error) {
      next(error);
    }
  };

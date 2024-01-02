import { Request, Response, NextFunction } from "express";
import CustomErrorMessage from "../utils/errorMessage";
import CustomError from "../utils/error";
const Category = require("../models/Category");
const Course = require("../models/Course");
const IsLessonDone = require("../models/IsLessonDone");
const Lesson = require("../models/Lesson");
const Order = require("../models/Order");
const Review = require("../models/Review");
const Section = require("../models/Section");
const User = require("../models/User");
const Blog = require("../models/Blog");
const axios = require("axios");
const { BACKEND_URL } = require("../config/backend-domain");

const {
  getProgressOfCourse,
  generateRandomAiImages,
  openai,
  generateRandomCourses,
  generateSectionsName,
  createOutline,
  getCourseDetailInfo,
  getCoursesOrderedByUserInfo,
  getLessonsByCourseId,
} = require("../utils/helper");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { UNSPLASH_API_KEY } = require("../config/constant");
const { searchYouTubeVideos } = require("../utils/youtube");
const Certificate = require("../models/Certificate");
// const Category = require('../models/category');



exports.getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      message: "Fetch categories sucessfully!",
      categories,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch categories!", 422);
      return error;
    }
    next(error);
  }
};

exports.getAuthors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await Course.find().populate("userId", "_id name");

    const authors = courses.map((course: any) => course.userId);

    const authorList = [
      ...new Map(
        authors.map((author: any) => {
          return [author.name, { name: author.name, _id: author._id }];
        })
      ),
    ];

    res.status(200).json({
      mesasge: "Fetch authors sucessfully!",
      authors: authorList,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch categories!", 422);
      return error;
    }
    next(error);
  }
};

exports.getCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { categoryId } = req.params;
  try {
    const category = await Category.findById(categoryId);

    res.status(200).json({
      message: "Fetch category by id successfully!",
      category,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch category by id!", 422);
      return error;
    }
    next(error);
  }
};

exports.updateViews = async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.params;

  try {
    const foundCourse = await Course.findById(courseId);

    foundCourse.views += 1;

    const result = await foundCourse.save();

    res.status(200).json({
      message: `view of Course: ${courseId} increase to 1`,
      result,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch category by id!", 422);
      // error.statusCode(422);
      return error;
    }
    next(error);
  }
};

exports.updateLessonDoneByUser = async (req: Request, res: Response, next: NextFunction) => {
  const { lessonId } = req.params;

  const { userId } = req.body;

  try {
    const lessonDoneByUser = await IsLessonDone.findOne({
      lessonId: lessonId,
      userId: userId,
    });

    if (!lessonDoneByUser) {
      const lessonDone = new IsLessonDone({
        lessonId: lessonId,
        userId: userId,
        isDone: true,
      });

      const result = await lessonDone.save();

      res.status(200).json({
        message: `Update lesson done successfully!`,
        result,
      });
    } else {
      res.status(200).json({
        message: `Lesson aldready done by user`,
        result: "nothing",
      });
    }
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to Update lesson done!", 422);
      return error;
    }
    next(error);
  }
};

const buildQuery = (req: Request) => {
  const { _q, _min, _max, _author, _level, _price, _topic } = req.query;
  const query: any = {};

  if (_q) {
    query.$text = { $search: _q };
  }

  if (_level) {

    query.level = {
      $in: (_level as string).split(","),
    };
  }

  if (_price === "Free") {
    query.finalPrice = 0;
  } else if (_price === "Paid") {
    query.finalPrice = { $gt: 0 };
  }

  if (_topic) {
    query.categoryId = { $in: (_topic as string).split(",") };
  }

  if (_author) {
    query.userId = {
      $in: (_author as string).split(","),
    };
  }

  if (_min !== undefined || _max !== undefined) {
    query.$expr = { $and: [] };

    if (_min !== undefined) {
      query.$expr.$and.push({
        $gte: [
          { $multiply: ["$oldPrice", { $subtract: [1, { $divide: ["$discount", 100] }] }] },
          parseFloat(_min as string),
        ],
      });
    }

    if (_max !== undefined) {
      query.$expr.$and.push({
        $lte: [
          { $multiply: ["$oldPrice", { $subtract: [1, { $divide: ["$discount", 100] }] }] },
          parseFloat(_max as string),
        ],
      });
    }
  }

  return query;
};

exports.getCourses = async (req: Request, res: Response, next: NextFunction) => {
  const { _limit, _sort, _q, _min, _max, _page, _cateIds, userId, _cateName } = req.query;

  const page = _page || 1;

  const skip = (+page - 1) * ( +_limit);

  try {
    const query = buildQuery(req);

    const coursesQuery = Course.find(query, {
      ...(query.$text && { score: { $meta: "textScore" } }),
    })
      .populate("categoryId", "_id name")
      .populate("userId", "_id name avatar")
      .skip(skip)
      .limit(_limit || 12);

    if (_sort) {
      const sortQuery: any = {
        ...(query.$text && { score: { $meta: "textScore" } }),
      };

      if (_sort === "newest") {
        sortQuery.createdAt = -1;
      }

      coursesQuery.sort(sortQuery);
    }

    const totalCourses = await Course.where(query).countDocuments();
    // const totalCourses = await Course.countDocuments(query);
    const courses = await coursesQuery;
    const coursesOfUser = await getCoursesOrderedByUserInfo(userId);
    const courseIdOfUserList = coursesOfUser.map((course: any) => course._id.toString());

    let result = [];

    for (const course of courses) {
      const courseItem = {
        ...course._doc,

        isBought: courseIdOfUserList.includes(course._id.toString()) ? true : false,
      };
      result.push(courseItem);
    }

    res.status(200).json({
      message: "Fetch all Courses successfully!",
      courses: result,
      pagination: {
        _page: +_page || 1,
        _limit: +_limit || 12,
        _totalRows: totalCourses,
      },
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch Courses!", 422);
      return error;
    }
    next(error);
  }
};

exports.getCoursesAfterLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { _limit, _sort, _q, _min, _max, _page, _cateIds, userId } = req.query;

  const page = _page || 1;

  const skip = (+page - 1) * (+ _limit);

  try {
    const query = buildQuery(req);

    const coursesQuery = Course.find(query, {
      ...(query.$text && { score: { $meta: "textScore" } }),
    })
      .populate("categoryId", "_id name")
      .populate("userId", "_id name avatar")
      .skip(skip)
      .limit(_limit || 12);

    if (_sort) {
      const sortQuery: any = {
        ...(query.$text && { score: { $meta: "textScore" } }),
      };

      if (_sort === "newest") {
        sortQuery.createdAt = -1;
      }

      coursesQuery.sort(sortQuery);
    }

    const totalCourses = await Course.where(query).countDocuments();
    // const totalCourses = await Course.countDocuments(query);
    const courses = await coursesQuery;

    // Get courses of users

    const coursesOfUser = await getCoursesOrderedByUserInfo(userId);

    const courseIdOfUserList = coursesOfUser.map((course: any) => course._id.toString());

    const result = [];

    for (const course of courses) {
      const courseItem = {
        ...course._doc,

        isBought: courseIdOfUserList.includes(course._id.toString()) ? true : false,
      };
      result.push(courseItem);
    }

    res.status(200).json({
      message: "Fetch all Courses successfully!",
      courses: result,
      pagination: {
        _page: +_page || 1,
        _limit: +_limit || 12,
        _totalRows: totalCourses,
      },
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch Courses!", 422);
      return error;
    }
    next(error);
  }
};

exports.getPopularCourses = async (req: Request, res: Response, next: NextFunction) => {
  const { _limit } = req.query;

  try {
    const coursePopularity = await Order.aggregate([
      { $unwind: "$items" }, // Unwind the items array --> What is unwind in this case
      { $group: { _id: "$items._id", count: { $sum: 1 } } }, // Group and count course occurrences, Why sum 1. Other params ?
      { $sort: { count: -1 } }, // Sort by count in descending order
      { $limit: +_limit || 10 }, // Limit the result to the top 10 courses, adjust as needed
    ]);

    const popularCourseIds = coursePopularity.map((entry: any) => entry._id);

    const totalCourses = (
      await Order.aggregate([
        { $unwind: "$items" }, // Unwind the items array --> What is unwind in this case
        { $group: { _id: "$items._id", count: { $sum: 1 } } }, // Group and count course occurrences, Why sum 1. Other params ?
      ])
    ).length;

    // Fetch course details using the popular IDs
    const popularCourses = await Course.find({ _id: { $in: popularCourseIds } })
      .populate("categoryId", "_id name")
      .populate("userId", "_id name avatar");

    res.status(200).json({
      message: "Fetch all popular Courses successfully!",
      courses: popularCourses,
      pagination: {
        _page: 1,
        _limit: +_limit || 10,
        _totalRows: totalCourses,
      },
      coursePopularity,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch popular Courses!", 422);
      return error;
    }
    next(error);
  }
};


exports.retrieveCartByIds = async (req: Request, res: Response, next: NextFunction) => {
  const { _courseIds } = req.query;

  if (!_courseIds) {
    res.status(200).json({
      message: "Cart is empty!",
      cart: {
        items: [],
        totalPrice: 0,
      },
    });

    return;
  }

  try {
    const courses = await Course.find({
      _id: { $in: (_courseIds as string).split(",") },
    }).select("_id name finalPrice thumbnail userId level");

    const totalPrice = courses.reduce((acc: number, course: any) => acc + course.finalPrice, 0);

    const result = [];

    for (const course of courses) {
      const courseDetailInfo = await getCourseDetailInfo(course._id);

      const cartItem = {
        _id: courseDetailInfo._id,
        name: courseDetailInfo.name,
        thumbnail: courseDetailInfo.thumbnail,
        finalPrice: courseDetailInfo.finalPrice,
        level: courseDetailInfo.level,
        userId: courseDetailInfo.userId,
        numOfReviews: courseDetailInfo.numOfReviews,
        totalVideosLength: courseDetailInfo.totalVideosLength,
        avgRatingStars: courseDetailInfo.avgRatingStars,
        lessons: courseDetailInfo.lessons,
      };
      result.push(cartItem);
    }

    res.status(200).json({
      message: "Fetch  cart by course ids list successfully!",
      cart: {
        items: result,
        totalPrice: totalPrice,
      },
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to retrieve cart from database", 422);
      return error;
    }
    next(error);
  }
};

exports.getSectionsByCourseId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;

    const sectionsOfCourse = await Section.find({ courseId });

    const result = sectionsOfCourse.map(async (section: any) => {
      const lessons = await Lesson.find({ sectionId: section._id });
      const totalVideosLength = lessons.reduce((acc: number, lesson: any) => acc + lesson.videoLength, 0);
      return {
        ...section._doc,
        numOfLessons: lessons.length,
        totalVideosLength,
      };
    });

    res.status(200).json({
      message: "Fetch all Sections by course id successfully!",
      sections: await Promise.all(result),
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch Sections by course id!", 422);
      return error;
    }
    next(error);
  }
};
exports.getSectionsByCourseIdEnrolledCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;

    const sectionsOfCourse = await Section.find({ courseId });

    res.status(200).json({
      message: "Fetch all Sections by course id successfully!",
      sections: sectionsOfCourse,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch Sections by course id!", 422);
      return error;
    }
    next(error);
  }
};

exports.getLessonsBySectionId = async (req: Request, res: Response, next: NextFunction) => {
  const { sectionId } = req.params;
  const userId = req.get("userId");

  try {
    const lessonsOfSection = await Lesson.find({
      sectionId: sectionId,
    });

    // const result = lessonsOfSection.map(async (lessonItem) => {
    //   const isDone = await IsLessonDone.findOne({
    //     userId: userId,
    //     lessonId: lessonItem._id,
    //   });

    //   return {
    //     _id: lessonItem._id,
    //     sectionId: lessonItem.sectionId,
    //     name: lessonItem.name,
    //     content: lessonItem.content,
    //     access: lessonItem.access,
    //     type: lessonItem.type,
    //     description: lessonItem.description,
    //     isDone: Boolean(isDone) ? true : false,
    //   };
    // });

    res.status(200).json({
      message: "Fetch all lessons of section id successfully!",
      lessons: lessonsOfSection,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch lessons!", 422);
      return error;
    }
    next(error);
  }
};

exports.getLessonsBySectionIdEnrolledCourse = async (req: Request, res: Response, next: NextFunction) => {
  const { sectionId } = req.params;
  const userId = req.get("userId");

  try {
    const lessonsOfSection = await Lesson.find({
      sectionId: sectionId,
    });

    const result = lessonsOfSection.map(async (lessonItem: any) => {
      const isDone = await IsLessonDone.findOne({
        userId: userId,
        lessonId: lessonItem._id,
      });

      return {
        _id: lessonItem._id,
        sectionId: lessonItem.sectionId,
        name: lessonItem.name,
        content: lessonItem.content,
        access: lessonItem.access,
        type: lessonItem.type,
        description: lessonItem.description,
        isDone: Boolean(isDone) ? true : false,
      };
    });

    res.status(200).json({
      message: "Fetch all lessons of section id successfully!",
      lessons: await Promise.all(result),
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch lessons!", 422);
      return error;
    }
    next(error);
  }
};

exports.getMaxPrice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const max = await Course.aggregate([
      {
        $project: {
          maxFieldValue: {
            $multiply: ["$oldPrice", { $subtract: [1, { $divide: ["$discount", 100] }] }],
          },
        },
      },
      {
        $sort: {
          maxFieldValue: -1,
        },
      },
      { $limit: 1 },
    ]);

    res.status(200).json({
      message: "OK",
      result: max,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch price value!", 422);
      return error;
    }
    next(error);
  }
};

exports.getMinPrice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const min = await Course.aggregate([
      {
        $project: {
          minFieldValue: {
            $multiply: ["$oldPrice", { $subtract: [1, { $divide: ["$discount", 100] }] }],
          },
        },
      },
      {
        $sort: {
          minFieldValue: 1,
        },
      },
      { $limit: 1 },
    ]);

    res.status(200).json({
      message: "OK",
      result: min,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch price value!", 422);
      return error;
    }
    next(error);
  }
};

exports.getCoursesInRange = async (req: Request, res: Response, next: NextFunction) => {
  const { _min, _max } = req.query;

  try {
    const Courses = await Course.find({
      $expr: {
        $and: [
          {
            $gte: ["$oldPrice", _min],
          },
          {
            $lte: ["$oldPrice", _max],
          },
          {
            $gte: [
              { $multiply: ["$oldPrice", { $subtract: [1, { $divide: ["$discount", 100] }] }] },
              _min,
            ],
          },

          {
            $gte: [
              { $multiply: ["$oldPrice", { $subtract: [1, { $divide: ["$discount", 100] }] }] },
              _max,
            ],
          },
        ],
      },
    });

    res.status(200).json({
      message: "Oke",
      Courses,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch Courses in range", 422);
      return error;
    }
    next(error);
  }
};

exports.getCourse = async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId)
      .populate("categoryId", "_id name")
      .populate("userId", "_id name");

    res.status(200).json({
      message: "Fetch single Course successfully!",
      course,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch Courses!", 422);
      return error;
    }
    next(error);
  }
};

exports.getCourseEnrolledByUserId = async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.params;
  const userId = req.get("userId");

  try {
    const course = await Course.findById(courseId)
      .populate("categoryId", "_id name")
      .populate("userId", "_id name");

    const sectionsOfCourse = await Section.find({
      courseId,
    });

    let numOfLessonDone = 0;

    let lessonsOfCourse = [];

    for (const section of sectionsOfCourse) {
      const lessons = await Lesson.find({
        sectionId: section._id,
      });
      lessonsOfCourse.push(lessons);
    }

    lessonsOfCourse = lessonsOfCourse.flat();

    const lessonIdsHasDone = [];
    for (const lesson of lessonsOfCourse) {
      const isDone = await IsLessonDone.findOne({
        userId,
        lessonId: lesson._id,
      });

      if (isDone) {
        numOfLessonDone += 1;
        lessonIdsHasDone.push(lesson._id);
      }
    }

    const result = {
      ...course._doc,
      progress: numOfLessonDone / lessonsOfCourse.length,
      sections: sectionsOfCourse,
      lessons: lessonsOfCourse,
      lessonsDone: lessonIdsHasDone,
    };

    res.status(200).json({
      message: "Fetch single Course enrolled by user id successfully!",
      course: result,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch Courses!", 422);
      return error;
    }
    next(error);
  }
};

exports.getCourseDetail = async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.params;
  const { userId } = req.query;

  try {
    const result = await getCourseDetailInfo(courseId);
    let isBought = false;
    if (userId) {
      const orders = await Order.find({ "user._id": userId });

      const userCourses = orders.reduce((courses: any, order: any) => {
        return courses.concat(order.items);
      }, []);

      const userCourseIds = userCourses.map((course: any) => course._id.toString());

      isBought = userCourseIds.includes(courseId);
    }

    res.status(200).json({
      message: "Fetch single Course successfully with and without user id!",
      course: {
        ...result,
        isBought,
      },
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch Courses!", 422);
      return error;
    }
    next(error);
  }
};

exports.getUserDetail = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    const courses = await Order.find({
      "user._id": userId,
    })
      .select("items")
      .populate("items._id");

    // .populate("categoryId", "_id name")
    // .populate("userId", "_id name");

    const coursesEnrolled = courses
      .map((courseItem: any) => {
        return courseItem.items;
      })
      .flat()
      .map((item: any) => item._id)
      .map(async (courseItem: any) => {
        const progress = (await getProgressOfCourse(courseItem._id, userId)).progress;
        const totalVideosLengthDone = (await getProgressOfCourse(courseItem._id, userId))
          .totalVideosLengthDone;
        const user = await User.findById(courseItem._doc.userId.toString());

        return {
          ...courseItem._doc,
          // user id here is author of course
          userId: {
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
          },
          progress: progress,
          totalVideosLengthDone,
        };
      });

    const result = {
      ...user._doc,
      courses: await Promise.all(coursesEnrolled),
    };

    res.status(200).json({
      message: "Fetch User Detail with fully data successfully!",
      user: result,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch Courses!", 422);
      return error;
    }
    next(error);
  }
};

exports.getCoursesOrderedByUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const courses = await getCoursesOrderedByUserInfo(userId);

    res.status(200).json({
      message: "Fetch Courses by user have ordered successfully!",
      courses: courses,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch Courses!", 422);
      return error;
    }
    next(error);
  }
};

exports.checkLessonDoneUserId = async (req: Request, res: Response, next: NextFunction) => {
  const { lessonId } = req.params;
  const { userId } = req.body;

  try {
    const lessonFound = await IsLessonDone.findOne({
      lessonId: lessonId,
      userId: userId,
    });

    res.status(200).json({
      message: "Check lesson done successfully!",
      lesson: lessonFound,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to check Lesson Done!", 422);
      return error;
    }
    next(error);
  }
};

exports.postOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { note, transaction, vatFee, items, user, totalPrice } = req.body;

  const status = totalPrice === 0 ? "Success" : "Pending";

  try {
    const courses = await Course.find({
      _id: {
        $in: items.map((item: any) => item.courseId),
      },
    });

    const order = new Order({
      note,
      vatFee,
      totalPrice,
      transaction: {
        method: transaction.method,
      },
      items: courses,
      user,
      status,
    });

    const response = await order.save();

    res.status(201).json({
      message: "Created order successfully!",
      order: response,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to post order!", 422);
      return error;
    }
    next(error);
  }
};

exports.getOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    res.status(200).json({
      message: "Get order by id successfully!",
      order,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to get order by id!", 422);
      return error;
    }
    next(error);
  }
};

exports.getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select(
      "_id name avatar email phone headline biography website twitter facebook linkedin youtube language showProfile showCourses"
    );

    const lessonDoneList = await IsLessonDone.find({
      userId: userId,
    });

    res.status(200).json({
      message: "fetch single user successfully!",
      user: user,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch categories!", 422);
      return error;
    }
    next(error);
  }
};

exports.postReview = async (req: Request, res: Response, next: NextFunction) => {
  const { courseId, title, content, ratingStar, orderId, userId } = req.body;

  try {
    const newReview = new Review({
      courseId,
      title,
      content,
      ratingStar,
      orderId,
      userId,
    });

    const result = await newReview.save();

    await Order.updateOne(
      { _id: orderId, "items._id": courseId },
      { $set: { "items.$.reviewed": true } }
    );

    res.status(201).json({
      message: "Review created successfully!",
      review: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCourseReviews = async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.params;

  try {
    const reviews = await Review.find({ courseId });

    res.status(200).json({
      message: "Fetch reviews successfully!",
      reviews,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to post course review!", 422);
      return error;
    }
    next(error);
  }
};

exports.updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  let updateData = {
    ...req.body,
  };

  if (req.file) {
    updateData.avatar = `${BACKEND_URL}/${req.file.path}`;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.status(200).json({
      message: "User updated successfully",
      userId: updatedUser._id,
    });
  } catch (error) {
    next(error);
  }
};

// Retrieve to see history to track orders.
exports.getOrdersByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const userId = req.params.userId;
    const totalItems = await Order.countDocuments({ "user._id": userId });
    const orders = await Order.find({ "user._id": userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Orders fetched successfully!",
      orders,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// List all of orders at db
exports.getOrders = async (req: Request, res: Response, next: NextFunction) => {};

// GET all invoice
exports.getInvoices = async (req: Request, res: Response, next: NextFunction) => {};

// POST (GENREATE) CERTIFICATIONS

const generateCertificate = (userName: string, courseName: string, completionDate: any, res: Response) => {
  // Load the certificate template
  // "images/certificate-template.pdf"

  const transformedCourseName = courseName.trim().split(" ").join("-");

  const certificateTemplatePath = path.join("images", "certificate-template.png");
  const certifcationName = `${userName}-${transformedCourseName}-certificate.pdf`;
  const outputCertification = path.join("images", certifcationName);
  const outputPath = `certificates/${userName}-certificate.pdf`;

  // Create a new PDF document
  const doc = new PDFDocument({ layout: "landscape" });

  res.setHeader("Content-Type", "application/pdf");
  // res.setHeader("Content-Disposition", "attachment", 'inline; filename="' + certifcationName + '"');
  res.setHeader("Content-Disposition", 'inline; filename="' + certifcationName + '"');
  // Pipe the PDF content to a writable stream (save it to a file)
  const writeStream = fs.createWriteStream(outputCertification);
  doc.pipe(writeStream);

  // Load the certificate template
  doc.image(certificateTemplatePath, 0, 0, { width: 792, height: 700 });

  // Function to center text horizontally
  const centerTextX = (text: any) => (doc.page.width - doc.widthOfString(text)) / 2;

  // // Function to center text vertically with a top margin
  // const centerTextY = (text) => doc.page.height / 2 + doc.heightOfString(text) / 2; // Adjust the top margin here

  // Add the user's name, course name, and completion date with technology-themed styling
  // , centerTextX(userName), centerTextY(userName)
  doc.fontSize(36).fillColor("#007BFF").text(userName, 100, 260, {
    align: "center",
  });
  // doc.moveUp(4);
  // doc.fontSize(28).fillColor("#4CAF50").text("Certificate of Completion", {
  //   align: "center",
  // });
  doc.fontSize(24).fillColor("#333").text(`Course: ${courseName}`, {
    align: "center",
  });
  doc.fontSize(16).fillColor("#555").text("This certificate is awarded to", {
    align: "center",
  });
  doc.fontSize(16).fillColor("#555").text(completionDate, {
    align: "center",
  });

  // Finalize the PDF document
  doc.end();

  return certifcationName;
};

exports.postCertificate = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, courseId, completionDate } = req.body;

  try {
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    const existingCertificate = await Certificate.findOne({
      "user._id": userId,
      "course._id": courseId,
    });

    if (existingCertificate) {
      const error = new Error("Certificate ready exisit");

      // throw new Error(error.message);
      res.status(401).json({
        message: "Certificate already exists!",
      });
      return;
    }

    const certificateName = generateCertificate(user.name, course.name, completionDate, res);

    const newCertificate = new Certificate({
      certificateName: certificateName,
      user: {
        _id: userId,
      },
      course: {
        _id: courseId,
      },
    });

    const createdCertificate = await newCertificate.save();

    res.status(201).json({
      message: "Post certificate successfully!",
      certificate: createdCertificate,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to create certificates for user!", 422);
      return error;
    }
    next(error);
  }
};

exports.deleteCertificate = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, courseId } = req.query;

  try {
    const response = await Certificate.deleteMany({
      "user._id": userId,
      "course._id": courseId,
    });

    res.status(201).json({
      message: "get certification successfully!",
      result: response,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to create certifications for user!", 422);
      return error;
    }
    next(error);
  }
};

exports.getCertificate = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, courseId } = req.query;

  try {
    const certificate = await Certificate.findOne({
      "user._id": userId,
      "course._id": courseId,
    });
    res.status(201).json({
      message: "get certification successfully!",
      certificate,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to create certifications for user!", 422);
      return error;
    }
    next(error);
  }
};

exports.getAiImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await openai.createImage({
      prompt: "Nodejs advanced thumbnail course",
      n: 3,
      size: "256x256",
    });

    const image_url = response.data.data[0].url;

    res.status(200).json({
      image: image_url,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getImagesFromUnsplash = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query: "Machine Learning",
        orientation: "landscape",
        client_id: UNSPLASH_API_KEY,
        per_page: 10,
      },
    });

    const randomIndex = Math.floor(Math.random() * response.data.results.length);

    res.status(200).json({
      message: "Fetch images from unsplash successfully!",
      response: response.data.results[randomIndex].urls.regular,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to get images from unsplash!", 422);
      return error;
    }
    next(error);
  }
};

exports.generateRandomCourses = async (req: Request, res: Response, next: NextFunction) => {
  const randomCourses = await generateRandomCourses(10);

  try {
    for (const course of randomCourses) {
      const newCourse = new Course(course);
      await newCourse.save();
    }

    res.status(200).json({
      courses: randomCourses,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to generate random courses!", 422);
      return error;
    }
    next(error);
  }
};

exports.createOutlineCourse = async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.body;

  try {
    const response = await createOutline(courseId);

    res.status(200).json({
      message: "Successfully to create outline course!",
      response,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.generateOutlineCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const outline = await generateSectionsName("64c5d873c573c1ec5d4a1907");

    res.status(200).json({
      message: "Successfully to generate outline course!",
      outline: outline,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to generate random courses!", 422);
      return error;
    }
    next(error);
  }
};

exports.generateLessonOfOutline = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const outline = await generateSectionsName("64c5d873c573c1ec5d4a18f5");

    const lessons = [];

    for (const sectionName of outline) {
      const currentLessons = await searchYouTubeVideos(sectionName);
      lessons.push(currentLessons);
    }

    res.status(200).json({
      message: "Successfully to generate lesson base on outline!",
      lessons,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to generate youtube videos and descriptions,... !", 422);
      return error;
    }
    next(error);
  }
};

exports.createLessonsOfOutlineCourse = async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.body;
  try {
    const outline = await Section.find({ courseId });

    const lessons = [];

    for (const sectionItem of outline) {
      // Search youtube video base on query.
      const currentYoutubeVideos = await searchYouTubeVideos(sectionItem.name);

      const currSectionId = sectionItem._id;

      const newLessons = currentYoutubeVideos.map((video: any) => {
        return {
          sectionId: currSectionId,
          name: video.title,
          content: video.link,
          description: video.title,
          access: "PAID",
          type: "video",
          videoLength: video.videoLength,
        };
      });

      const createdLessons = await Lesson.insertMany(newLessons);
      lessons.push(createdLessons);
    }

    res.status(200).json({
      message: "Successfully to create lessons base on outline!",
      lessons: lessons.flat(),
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to generate youtube videos and descriptions,... !", 422);
      return error;
    }
    next(error);
  }
};

exports.generateTheWholeCourse = async (req: Request, res: Response, next: NextFunction) => {
  const courseId = "64c5d873c573c1ec5d4a18f5";

  try {
    const outline = await generateSectionsName(courseId);

    // const sectionsCreatedcc = await Section.insertMany(outline);

    const lessons = [];

    for (const sectionName of outline) {
      // Search youtube video base on query.
      const currentYoutubeVideos = await searchYouTubeVideos(sectionName);

      // const currSectionId = sectionItem._id;

      const newLessons = currentYoutubeVideos.map((video: any) => {
        return {
          sectionId: "sdjfkldsjfklsdjfkldsjfkdsljf",
          name: video.title,
          content: video.link,
          description: video.title,
          access: "PAID",
          type: "video",
          videoLength: video.videoLength,
        };
      });

      // const createdLessons = await Lesson.insertMany(newLessons);
      lessons.push(newLessons);
    }

    const newCourse = {
      courseId,
      sections: outline,
      lessons: lessons.flat(),
    };

    res.status(200).json({
      message: "Successfully to generate the whole course with course id",
      courseCreated: newCourse,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to generate the whole course with course id", 422);
      return error;
    }
    next(error);
  }
};

exports.createTheWholeCourse = async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.body;

  try {
    const sectionNameList = await generateSectionsName(courseId);
    const outline = sectionNameList.map((sectionName: string, index: number) => {
      return {
        courseId,
        name: `Section ${String(index + 1).padStart(2, "0")}: ${sectionName}`,
        access: "PAID", // Adjust the access type as needed
        description: sectionName, // Add a description for each section if required
      };
    });
    const sectionsCreated = await Section.insertMany(outline);

    const sectionsFound = await Section.find({ courseId });

    const lessons = [];

    for (const sectionItem of sectionsFound) {
      // Search youtube video base on query.
      const currentYoutubeVideos = await searchYouTubeVideos(sectionItem.name);

      const currSectionId = sectionItem._id;

      const newLessons = currentYoutubeVideos.map((video: any) => {
        return {
          sectionId: currSectionId,
          name: video.title,
          content: video.link,
          description: video.title,
          access: "PAID",
          type: "video",
          videoLength: video.videoLength,
        };
      });

      const createdLessons = await Lesson.insertMany(newLessons);
      lessons.push(createdLessons);
    }

    const newCourse = {
      courseId,
      sections: outline,
      lessons: lessons.flat(),
    };

    res.status(200).json({
      message: "Successfully to generate the whole course with course id",
      courseCreated: newCourse,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to generate the whole course with course id", 422);
      return error;
    }
    next(error);
  }
};

exports.getRelatedCourses = async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.params;
  const userId = req.query.userId;
  let limit: number = +req.query.limit || 5 ;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const relatedCourses = await Course.find({
      _id: { $ne: courseId },
      categoryId: course.categoryId,
    })
      .populate("categoryId", "_id name")
      .populate("userId", "_id name avatar")
      .limit(limit);

    if (!userId) {
      return res.status(200).json({
        message: "List of related courses",
        relatedCourses,
      });
    }

    const coursesOfUser = await getCoursesOrderedByUserInfo(userId);
    const courseIdOfUserList = coursesOfUser.map((course: any) => course._id.toString());

    let result = relatedCourses.map((course: any) => {
      return {
        ...course._doc,
        isBought: courseIdOfUserList.includes(course._id.toString()),
      };
    });

    res.status(200).json({
      message: "List of related courses",
      relatedCourses: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadVideo = (req: Request, res: Response) => {
  try {
    const videoPath = req.file.path;

    const fullVideoPath = `${BACKEND_URL}/${videoPath}`;

    const response = {
      message: "Video uploaded successfully",
      videoPath: fullVideoPath,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while uploading the video" });
  }
};

exports.getSuggestedCourses = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;
  let limit = req.query.limit ? +req.query.limit : 5;

  try {
    const boughtCourses = await getCoursesOrderedByUserInfo(userId);

    if (!boughtCourses.length) {
      return res.status(200).json({
        message: "No suggestions available as no courses have been purchased.",
        suggestedCourses: [],
      });
    }

    const boughtCourseCategories = boughtCourses.map((course: any) => course.categoryId.toString());

    const suggestedCourses = await Course.find({
      categoryId: { $in: boughtCourseCategories },
      _id: { $nin: boughtCourses.map((course: any) => course._id) },
    })
      .populate("categoryId", "_id name")
      .populate("userId", "_id name avatar")
      .limit(limit);

    res.status(200).json({
      message: "List of suggested courses",
      suggestedCourses,
    });
  } catch (error) {
    next(error);
  }
};

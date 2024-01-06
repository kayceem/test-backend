import CustomErrorMessage from "../utils/errorMessage";
import { Request, Response, NextFunction } from "express";

const { faker } = require("@faker-js/faker");
import Category from "../models/Category";
const Lesson = require("../models/Lesson");
import Course from "../models/Course";

const { deleteFile } = require("../utils/file");
const { validationResult } = require("express-validator");
const IsLessonDone = require("../models/IsLessonDone");
import User from "../models/User";

import Order from "../models/Order";

const { getProgressOfCourse, getCourseDetailInfo } = require("../utils/helper");

exports.getSummaryReports = async (req: Request, res: Response, next: NextFunction) => {
  // Get the current date
  const currentDate = new Date();
  // Calculate the date 30 days ago
  const thirtyDaysAgo = new Date(currentDate);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const categories = await Category.countDocuments();
    const courses = await Course.countDocuments();
    const users = await User.countDocuments();

    const orders = await Order.find({
      createdAt: { $gte: thirtyDaysAgo, $lte: currentDate },
    });

    const saleOf30days = orders.reduce((total: number, order: any) => {
      return total + order.totalPrice;
    }, 0);

    const avgTimeLearningPerUser = 10;
    const conversions = 50;

    const reports = {
      categories,
      courses,
      users,
      orders,
      saleOf30days,
      avgTimeLearningPerUser,
      conversions,
    };

    // const lessons = await Lesson.find();
    res.status(200).json({
      message: "Successfully to get summary reports",
      reports: reports,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to get summary reports!", 422);
      return error;
    }
    next(error);
  }
};

exports.getCourseSales = async (req: Request, res: Response, next: NextFunction) => {
  const previousDays = req.query.days || 7;
  // Get the current date
  const currentDate = new Date();
  // Calculate the date 30 days ago
  const previousDaysAgo = new Date(currentDate);
  previousDaysAgo.setDate(previousDaysAgo.getDate() - +previousDays);

  try {
    const orders = await Order.find({
      createdAt: { $gte: previousDaysAgo, $lte: currentDate },
    });

    const numberSalesByDate: any = {};

    orders.forEach((order: any) => {
      const date = order.createdAt.toDateString();
      console.log("Date: ", date);
      if (!numberSalesByDate[date]) {
        numberSalesByDate[date] = 0;
      }
      numberSalesByDate[date] += 1;

      console.log(numberSalesByDate);
    });

    // Prepare the response data in the format suitable for ChartJS
    const labels = [];
    const data = [];
    let currentDateIter = new Date(previousDaysAgo);
    while (currentDateIter <= currentDate) {
      const dateStr = currentDateIter.toDateString();
      labels.push(dateStr);
      data.push(numberSalesByDate[dateStr] || 0);
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }

    res.status(200).json({
      message: "Successfully to get course sales",
      labels,
      data,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch course sales!", 422);
      return error;
    }
    next(error);
  }
};

exports.getRevenues = async (req: Request, res: Response, next: NextFunction) => {
  const previousDays = req.query.days || 7;
  // Get the current date
  const currentDate = new Date();
  // Calculate the date 30 days ago
  const previousDaysAgo = new Date(currentDate);
  previousDaysAgo.setDate(previousDaysAgo.getDate() - +previousDays);

  try {
    const orders = await Order.find({
      createdAt: { $gte: previousDaysAgo, $lte: currentDate },
    });

    const salesByDate: any = {};

    orders.forEach((order: any) => {
      const date = order.createdAt.toDateString();
      if (!salesByDate[date]) {
        salesByDate[date] = 0;
      }
      salesByDate[date] += order.totalPrice;
    });

    // Prepare the response data in the format suitable for ChartJS
    const labels = [];
    const data = [];
    let currentDateIter = new Date(previousDaysAgo);
    while (currentDateIter <= currentDate) {
      const dateStr = currentDateIter.toDateString();
      labels.push(dateStr);
      data.push(salesByDate[dateStr] || 0);
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }

    res.status(200).json({
      message: "Successfully to get course revenues",
      labels,
      data,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch course revenues", 422);
      return error;
    }
    next(error);
  }
};

exports.getNewUserSignups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const previousDays = req.query.days || 7;
    // Get the current date
    const currentDate = new Date();
    // Calculate the date 30 days ago
    const previousDaysAgo = new Date(currentDate);
    previousDaysAgo.setDate(previousDaysAgo.getDate() - +previousDays);

    const users = await User.find({
      createdAt: { $gte: previousDaysAgo, $lte: currentDate },
    });

    const salesByDate: any = {};

    users.forEach((user: any) => {
      const date = user.createdAt.toDateString();
      if (!salesByDate[date]) {
        salesByDate[date] = 0;
      }
      salesByDate[date] += 1;
    });

    // Prepare the response data in the format suitable for ChartJS
    const labels = [];
    const data = [];
    const daysAgo = [];
    let currentDateIter = new Date(previousDaysAgo);
    while (currentDateIter <= currentDate) {
      const dateStr = currentDateIter.toDateString();
      labels.push(dateStr);
      data.push(salesByDate[dateStr] || 0);
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }

    res.status(200).json({
      message: "Successfully to get  new users signup",
      labels,
      data,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch users new signup", 422);
      return error;
    }
    next(error);
  }
};

exports.getNewUserSignupsList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const previousDays = req.query.days || 60;
    // Get the current date
    const currentDate = new Date();
    // Calculate the date 30 days ago
    const previousDaysAgo = new Date(currentDate);
    previousDaysAgo.setDate(previousDaysAgo.getDate() - +previousDays);

    const users = await User.find({
      createdAt: { $gte: previousDaysAgo, $lte: currentDate },
    });

    const salesByDate: any = {};

    users.forEach((user: any) => {
      const date = user.createdAt.toDateString();
      if (!salesByDate[date]) {
        salesByDate[date] = 0;
      }
      salesByDate[date] += 1;
    });

    // Prepare the response data in the format suitable for ChartJS
    const labels = [];
    const data = [];
    const daysAgo = [];
    let currentDateIter = new Date(previousDaysAgo);
    while (currentDateIter <= currentDate) {
      const dateStr = currentDateIter.toDateString();
      labels.push(dateStr);
      data.push(salesByDate[dateStr] || 0);
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }

    res.status(200).json({
      message: "Successfully to get  new users signup",
      labels,
      data,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch users new signup", 422);
      return error;
    }
    next(error);
  }
};

exports.getReportsUserProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();

    const result = [];

    for (const user of users) {
      const lastEnrollment = await Order.find({ "user._id": user._id })
        .sort({ createdAt: -1 })
        .limit(1);

      const orders = await Order.find({ "user._id": user._id });

      const userCourses = orders.reduce((courses: any, order: any) => {
        return courses.concat(order.items);
      }, []);

      let studyTime = 0;
      const completedCourses = [];
      for (const course of userCourses) {
        const { progress, totalVideosLengthDone } = await getProgressOfCourse(course._id, user._id);
        studyTime += totalVideosLengthDone;
        if (progress === 1) {
          completedCourses.push(course);
        }
      }

      const userReportItem = {
        _id: user._id,
        name: user.name,
        role: user.role,
        registerd: user.createdAt,
        lastLogin: user.lastLogin, // Change later
        lastEnrollment: lastEnrollment[0]?.createdAt || null,
        studyTime: studyTime,
        totalTimeOnPlatform: 80000,
        allCourses: userCourses.length,
        completedCourses: completedCourses.length,
        inCompletedCourses: userCourses.length - completedCourses.length,
        certificates: completedCourses.length,
        avgScore: 0,
      };

      result.push(userReportItem);
    }

    res.status(200).json({
      message: "Successfully to get reports of user progress",
      reports: result,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch reports of user progress", 422);
      return error;
    }
    next(error);
  }
};

exports.getReportsCourseInsights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await Course.find();

    const results = [];

    for (const course of courses) {
      const learners = await Order.find({ "items._id": course._id });
      const courseInfo = await getCourseDetailInfo(course._id);

      const studentsOfCourse = learners.map((student: any) => student.user);

      let totalStudyTime = 0;
      for (const student of studentsOfCourse) {
        const { totalVideosLengthDone } = await getProgressOfCourse(course._id, student._id);
        totalStudyTime += totalVideosLengthDone;
      }

      const avgStudyTime = totalStudyTime / studentsOfCourse.length;

      const courseReportItem = {
        _id: course._id,
        name: course.name,
        learners: learners.length,
        avgStudyTime: studentsOfCourse.length === 0 ? 0 : avgStudyTime,
        views: course.views,
        socialInteractions: 0,
        totalVideosLength: courseInfo.totalVideosLength,
        lessons: courseInfo.lessons,
      };

      results.push(courseReportItem);
    }

    res.status(200).json({
      message: "Successfully to get reports of course insights",
      reports: results,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch reports of course insights", 422);
      return error;
    }
    next(error);
  }
};

import { Request, Response, NextFunction } from "express";
import Category from "../../models/Category";
import Course from "../../models/Course";
import User from "../../models/User";
import Order from "../../models/Order";
import CustomError from "../../utils/error";
import CustomErrorMessage from "../../utils/errorMessage";
import { getProgressOfCourse, getCourseDetailInfo } from "../../utils/helper";

interface UserReportItem {
  _id: string;
  name: string;
  role: string;
  registered: Date;
  lastLogin: Date | null;
  lastEnrollment: Date | null;
  studyTime: number;
  totalTimeOnPlatform: number;
  allCourses: number;
  completedCourses: number;
  inCompletedCourses: number;
  certificates: number;
  avgScore: number;
}

interface CourseReportItem {
  _id: string;
  name: string;
  learners: number;
  avgStudyTime: number;
  views: number;
  socialInteractions: number;
  totalVideosLength: number;
  lessons: number;
}

export const getSummaryReports = async (req: Request, res: Response, next: NextFunction) => {
  const currentDate = new Date();
  const thirtyDaysAgo = new Date(currentDate);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const categories = await Category.countDocuments();
    const courses = await Course.countDocuments();
    const users = await User.countDocuments();

    const orders = await Order.find({
      createdAt: { $gte: thirtyDaysAgo, $lte: currentDate },
    });

    const saleOf30days = orders.reduce((total, order) => {
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

    res.status(200).json({
      message: "Successfully to get summary reports",
      reports: reports,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to get summary reports!", 422);
      return next(customError);
    }
  }
};

export const getCourseSales = async (req: Request, res: Response, next: NextFunction) => {
  let previousDays: number = parseInt(req.query.days as string) || 7;

  if (previousDays < 0) {
    previousDays = 7;
  }

  const currentDate: Date = new Date();
  const previousDaysAgo: Date = new Date(currentDate);
  previousDaysAgo.setDate(previousDaysAgo.getDate() - previousDays);

  try {
    const orders = await Order.find({
      createdAt: { $gte: previousDaysAgo, $lte: currentDate },
    });

    const numberSalesByDate: { [key: string]: number } = {};

    orders.forEach((order) => {
      const date = order.createdAt.toDateString();
      if (!numberSalesByDate[date]) {
        numberSalesByDate[date] = 0;
      }
      numberSalesByDate[date] += 1;
    });

    const labels: string[] = [];
    const data: number[] = [];
    let currentDateIter: Date = new Date(previousDaysAgo);
    while (currentDateIter <= currentDate) {
      const dateStr: string = currentDateIter.toDateString();
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
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch course sales!", 422);
      return next(customError);
    }
  }
};

export const getRevenues = async (req: Request, res: Response, next: NextFunction) => {
  let previousDays: number = parseInt(req.query.days as string) || 7;

  if (previousDays < 0) {
    previousDays = 7;
  }

  const currentDate: Date = new Date();
  const previousDaysAgo: Date = new Date(currentDate);
  previousDaysAgo.setDate(previousDaysAgo.getDate() - previousDays);

  try {
    const orders = await Order.find({
      createdAt: { $gte: previousDaysAgo, $lte: currentDate },
    });

    const salesByDate: { [key: string]: number } = {};

    orders.forEach((order) => {
      const date = order.createdAt.toDateString();
      if (!salesByDate[date]) {
        salesByDate[date] = 0;
      }
      salesByDate[date] += order.totalPrice;
    });

    const labels: string[] = [];
    const data: number[] = [];
    let currentDateIter: Date = new Date(previousDaysAgo);
    while (currentDateIter <= currentDate) {
      const dateStr: string = currentDateIter.toDateString();
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
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch course revenues!", 422);
      return next(customError);
    }
  }
};

export const getNewUserSignups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let previousDays: number = parseInt(req.query.days as string) || 7;

    if (previousDays < 0) {
      previousDays = 7;
    }

    const currentDate: Date = new Date();
    const previousDaysAgo: Date = new Date(currentDate);
    previousDaysAgo.setDate(previousDaysAgo.getDate() - previousDays);

    const users = await User.find({
      createdAt: { $gte: previousDaysAgo, $lte: currentDate },
    });

    const signupsByDate: { [key: string]: number } = {};

    users.forEach((user) => {
      const date = user.createdAt.toDateString();
      if (!signupsByDate[date]) {
        signupsByDate[date] = 0;
      }
      signupsByDate[date] += 1;
    });

    const labels: string[] = [];
    const data: number[] = [];
    const daysAgo: Date[] = [];
    let currentDateIter: Date = new Date(previousDaysAgo);
    while (currentDateIter <= currentDate) {
      const dateStr: string = currentDateIter.toDateString();
      labels.push(dateStr);
      data.push(signupsByDate[dateStr] || 0);
      daysAgo.push(new Date(currentDateIter));
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }

    res.status(200).json({
      message: "Successfully to get new users signup",
      labels,
      data,
      daysAgo,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch users new signup", 422);
      return next(customError);
    }
  }
};

export const getNewUserSignupsList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let previousDays: number = parseInt(req.query.days as string) || 60;

    if (previousDays < 0) {
      previousDays = 60;
    }

    const currentDate: Date = new Date();
    const previousDaysAgo: Date = new Date(currentDate);
    previousDaysAgo.setDate(previousDaysAgo.getDate() - previousDays);

    const users = await User.find({
      createdAt: { $gte: previousDaysAgo, $lte: currentDate },
    });

    const signupsByDate: { [key: string]: number } = {};

    users.forEach((user) => {
      const date = user.createdAt.toDateString();
      if (!signupsByDate[date]) {
        signupsByDate[date] = 0;
      }
      signupsByDate[date] += 1;
    });

    const labels: string[] = [];
    const data: number[] = [];
    const daysAgo: Date[] = [];
    let currentDateIter: Date = new Date(previousDaysAgo);
    while (currentDateIter <= currentDate) {
      const dateStr: string = currentDateIter.toDateString();
      labels.push(dateStr);
      data.push(signupsByDate[dateStr] || 0);
      daysAgo.push(new Date(currentDateIter));
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }

    res.status(200).json({
      message: "Successfully to get new users signup",
      labels,
      data,
      daysAgo,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch users new signup", 422);
      return next(customError);
    }
  }
};

export const getReportsUserProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: SHOULD SEARCH FOR USER HAVE ROLE (USER - STUDENT!)
    const users = await User.find();

    const result: UserReportItem[] = [];

    for (const user of users) {
      const lastEnrollment = await Order.find({ "user._id": user._id })
        .sort({ createdAt: -1 })
        .limit(1);

      const orders = await Order.find({ "user._id": user._id });

      const userCourses = orders.reduce((courses, order) => {
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

      const userReportItem: UserReportItem = {
        _id: user._id,
        name: user.name,
        role: user.role,
        registered: user.createdAt,
        lastLogin: user.lastLogin,
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
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch reports of user progress", 422);
      return next(customError);
    }
  }
};

export const getReportsCourseInsights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // SHOULD BE OPIMIZE PERFORMANCE FOR WEBSITE ABOUT REPORT!
    const courses = await Course.find();

    const results: CourseReportItem[] = [];

    for (const course of courses) {
      const learners = await Order.find({ "items._id": course._id });
      const courseInfo = await getCourseDetailInfo(course._id);

      const studentsOfCourse = learners.map((student) => student.user);

      let totalStudyTime = 0;
      for (const student of studentsOfCourse) {
        const { totalVideosLengthDone } = await getProgressOfCourse(course._id, student._id);
        totalStudyTime += totalVideosLengthDone;
      }

      const avgStudyTime =
        studentsOfCourse.length === 0 ? 0 : totalStudyTime / studentsOfCourse.length;

      const courseReportItem: CourseReportItem = {
        _id: course._id,
        name: course.name,
        learners: learners.length,
        avgStudyTime: avgStudyTime,
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
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch reports of course insights", 422);
      return next(customError);
    }
  }
};

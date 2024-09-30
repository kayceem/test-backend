import { Request, Response, NextFunction } from "express";
import Wishlist from "../../models/Wishlist";
import { getCourseDetailInfo } from "../../utils/helper";
import Course from "../../models/Course";
import { ICourse } from "../../types/course.type";
import Section from "../../models/Section";
import { ISection } from "../../types/section.type";
import Lesson from "../../models/Lesson";
import { ILesson } from "../../types/lesson.type";
import IsLessonDone from "../../models/IsLessonDone";
import Order from "../../models/Order";
import { IOrder } from "../../types/order.type";
import { getCoursesOrderedByUserInfo } from "../../utils/helper";
import CustomError from "../../utils/error";
import CustomErrorMessage from "../../utils/errorMessage";
import Review from "../../models/Review";
import { AuthorAuthRequest } from "../../middleware/is-auth";
import { UserAuthRequest } from "../../middleware/is-user-auth";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  CREATE_SUCCESS,
  ERROR_CREATE_DATA,
  ERROR_GET_DATA,
  ERROR_GET_DATA_DETAIL,
  ERROR_GET_DATA_HISTORIES,
  ERROR_NOT_FOUND_DATA,
  ERROR_UPDATE_ACTIVE_DATA,
  ERROR_UPDATE_DATA,
  GET_DETAIL_SUCCESS,
  GET_HISOTIES_SUCCESS,
  GET_SUCCESS,
  UPDATE_ACTIVE_SUCCESS,
  UPDATE_SUCCESS,
} from "../../config/constant";
interface DecodedToken extends JwtPayload {
  userId: string;
}
interface QueryParameters {
  _q?: string;
  _min?: string;
  _max?: string;
  _author?: string;
  _level?: string;
  _price?: "Free" | "Paid";
  _topic?: string;
}

interface CourseQuery {
  $text?: {
    $search: string;
  };
  level?: {
    $in: string[];
  };
  finalPrice?: number | { $gt: number };
  categoryId?: {
    $in: string[];
  };
  userId?: {
    $in: string[];
  };
  $expr?: {
    $and: {
      $gte?: [object, number];
      $lte?: [object, number];
    }[];
  };
}

interface SortQuery {
  [key: string]: 1 | -1 | { $meta: "textScore" };
}

const buildQuery = (req: Request): CourseQuery => {
  const queryParameters: QueryParameters = req.query as QueryParameters;
  const { _q, _min, _max, _author, _level, _price, _topic } = queryParameters;
  const query: CourseQuery = {};

  if (_q) {
    query.$text = { $search: _q };
  }

  if (_level) {
    query.level = {
      $in: _level.split(","),
    };
  }

  if (_price === "Free") {
    query.finalPrice = 0;
  } else if (_price === "Paid") {
    query.finalPrice = { $gt: 0 };
  }

  if (_topic) {
    query.categoryId = {
      $in: _topic.split(","),
    };
  }

  if (_author) {
    query.userId = {
      $in: _author.split(","),
    };
  }

  if (_min !== undefined || _max !== undefined) {
    query.$expr = { $and: [] };

    if (_min !== undefined) {
      query.$expr.$and.push({
        $gte: [
          { $multiply: ["$oldPrice", { $subtract: [1, { $divide: ["$discount", 100] }] }] },
          parseFloat(_min),
        ],
      });
    }

    if (_max !== undefined) {
      query.$expr.$and.push({
        $lte: [
          { $multiply: ["$oldPrice", { $subtract: [1, { $divide: ["$discount", 100] }] }] },
          parseFloat(_max),
        ],
      });
    }
  }

  return query;
};

export const getCourses = async (req: Request, res: Response, next: NextFunction) => {
  const { _limit, _sort, _page } = req.query;

  const currentUserRole = req.headers.role;
  let userId = "";
  if (currentUserRole !== "client") {
    // Get userId when user login
    const authorizationHeader = req.headers.authorization;
    const tokenArray = authorizationHeader.split(" ");
    const token = tokenArray[1];
    // const userId = req.userId;
    const decodedToken: DecodedToken = jwt.verify(token, "somesupersecret") as DecodedToken;
    userId = decodedToken.userId;
  }
  let limit = parseInt(_limit as string);
  let page = parseInt(_page as string);

  limit = limit > 0 ? limit : 12;
  page = page > 0 ? page : 1;

  const skip = (page - 1) * limit;
  // Create dict
  const dictCoursesOfUser: Record<string, any> = {};
  const dictCourse: Record<string, any> = {};
  const dictReviewsOfCourse: Record<string, any> = {};
  const dictUsersOfCourse: Record<string, any> = {};

  try {
    const query = buildQuery(req);

    const coursesQuery = Course.find(query, {
      ...(query.$text && { score: { $meta: "textScore" } }),
    })
      .populate("categoryId", "_id name")
      .populate("userId", "_id name avatar")
      .skip(skip)
      .limit(limit);

    // If there is a course arrangement!
    if (_sort) {
      let sortQuery: SortQuery = {
        ...(query.$text && { score: { $meta: "textScore" } }),
      };
      // Sort by the latest course
      if (_sort === "newest") {
        sortQuery.createdAt = -1;
      }

      coursesQuery.sort(sortQuery);
    }
    const ordersRes = await Order.find({
      status: "Success"
    });
    const reviewsRes = await Review.find();

    const orderDetails = ordersRes.flatMap((order) => {
      return order.items.map((item: any) => ({
        orderId: order._id,
        userId: order.user._id,
        userEmail: order.user.email,
        // ... other relevant order fields if needed

        courseId: item._id,
        courseName: item.name,
        courseThumbnail: item.thumbnail,
        coursePrice: item.finalPrice,
        reviewed: item.reviewed,
      }));
    });
    // create dict courses of user
    orderDetails.forEach((item) => {
      if (item.userId) {
        if (dictCoursesOfUser[item.userId]) {
          dictCoursesOfUser[item.userId].push(item);
        } else {
          dictCoursesOfUser[item.userId] = [item];
        }
      }

      if (item.courseId) {
        if (dictUsersOfCourse[item.courseId]) {
          dictUsersOfCourse[item.courseId].push(item);
        } else {
          dictUsersOfCourse[item.courseId] = [item];
        }
      }
    });

    reviewsRes.forEach((reviewItem) => {
      if (reviewItem.courseId) {
        const currentKey = reviewItem.courseId.toString();
        if (dictReviewsOfCourse[currentKey]) {
          dictReviewsOfCourse[currentKey].push(reviewItem);
        } else {
          dictReviewsOfCourse[currentKey] = [reviewItem];
        }
      }
    });

    let totalCourses = await Course.where(query).countDocuments();
    const courses: ICourse[] = await coursesQuery;

    let courseIdOfUserList: string[] = [];
    if (typeof userId === "string" && userId.trim() !== "") {
      const listCourseOfUser = dictCoursesOfUser[userId] ?? [];
      let listCourseIdOfUser = [];
      if (listCourseOfUser.length > 0) {
        listCourseIdOfUser = listCourseOfUser.map((course: any) => course.courseId.toString());
      }
      if (listCourseOfUser.length > 0) {
        courseIdOfUserList = [...new Set<string>(listCourseIdOfUser)];
      } else {
        courseIdOfUserList = [];
      }
    }

    let result: Array<ICourse & { isBought: boolean }> = [];
    // TODO::Fix Bug
    for (const course of courses) {
      const currentCourseId = course._id.toString();
      const listReviewsOfCurrentCourse = dictReviewsOfCourse[currentCourseId] ?? [];
      const listUsersOfCurrentCourse = dictUsersOfCourse[currentCourseId] ?? [];

      let avgRatings = 0;
      if (listReviewsOfCurrentCourse.length > 0) {
        avgRatings =
          listReviewsOfCurrentCourse.reduce(
            (total, review) => total + (review?.ratingStar || 0),
            0
          ) / listReviewsOfCurrentCourse.length;
      }

      const courseItem = {
        ...course.toObject(),
        avgRatings: avgRatings,
        numberUsersOfCourse: listUsersOfCurrentCourse.length,
        isBought:
          typeof userId === "string" && userId.trim() !== ""
            ? courseIdOfUserList.includes(currentCourseId)
            : false,
      };

      result.push(courseItem);
    }
    // Arrange the course Review (default)
    if (!_sort || _sort === "mostReviews") {
      result.sort((a: any, b: any) => {
        return b.avgRatings - a.avgRatings;
      });
    }

    // Filter the Review Course
    if (req.query._avgRatings && parseFloat(req.query._avgRatings as string) >= 3) {
      const _avgRatings = parseFloat(req.query._avgRatings as string);
      result = result.filter((item: any) => item.avgRatings >= _avgRatings);
      totalCourses = result.length;
    }

    res.status(200).json({
      message: "Fetch all courses successfully!",
      courses: result,
      pagination: {
        _page: page,
        _limit: limit,
        _totalRows: totalCourses,
      },
      test: "production changes",
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch courses!", 422);
      return next(customError);
    }
  }
};

// WRITE API AGAIN!
export const getPopularCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { _limit } = req.query;

  let limit = parseInt(_limit as string);

  limit = limit > 0 ? limit : 10;

  try {
    const coursePopularity = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items._id", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit + 2 }, // TRICK FIX LATER!
    ]);

    const popularCourseIds = coursePopularity.map((entry) => entry._id);

    const totalCourses = (
      await Order.aggregate([
        { $unwind: "$items" },
        { $group: { _id: "$items._id", count: { $sum: 1 } } },
      ])
    ).length;

    const popularCourses: ICourse[] = await Course.find({ _id: { $in: popularCourseIds } })
      .populate("categoryId", "_id name")
      .populate("userId", "_id name avatar");

    res.status(200).json({
      message: "Fetch all popular courses successfully!",
      courses: popularCourses,
      pagination: {
        _page: 1,
        _limit: limit,
        _totalRows: totalCourses,
      },
      coursePopularity,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch popular courses!", 422);
      return next(customError);
    }
  }
};

export const getCourse = async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.params;

  try {
    const course = (await Course.findById(courseId)
      .populate("categoryId", "_id name")
      .populate("userId", "_id name")) as ICourse | null;

    if (!course) {
      const error = new CustomError("Course", "Course not found", 404);
      throw error;
    }

    res.status(200).json({
      message: "Fetch single course successfully!",
      course,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch course!", 422);
      return next(customError);
    }
  }
};

export const getCourseEnrolledByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const courseId = req.params.courseId;
  const userId = req.get("userId") || "";

  try {
    const course = (await Course.findById(courseId)
      .populate("categoryId", "_id name")
      .populate("userId", "_id name")) as ICourse | null;

    if (!course) {
      const error = new CustomError("Course", "Course not found", 404);
      throw error;
    }

    const sectionsOfCourse: ISection[] = await Section.find({ courseId });

    let numOfLessonDone = 0;
    let lessonsOfCourse: ILesson[] = [];

    for (const section of sectionsOfCourse) {
      const lessons: ILesson[] = await Lesson.find({ sectionId: section._id });
      lessonsOfCourse.push(...lessons);
    }

    const lessonIdsHasDone: string[] = [];

    for (const lesson of lessonsOfCourse) {
      const isDone = await IsLessonDone.findOne({
        userId,
        lessonId: lesson._id,
      });

      if (isDone) {
        numOfLessonDone += 1;
        lessonIdsHasDone.push(lesson._id.toString());
      }
    }

    const progress = numOfLessonDone / lessonsOfCourse.length;

    const result = {
      ...course.toObject(),
      progress,
      sections: sectionsOfCourse,
      lessons: lessonsOfCourse,
      lessonsDone: lessonIdsHasDone,
    };

    res.status(200).json({
      message: "Fetch single course enrolled by user id successfully!",
      course: result,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch courses!", 422);
      return next(customError);
    }
  }
};

export const getCourseDetail = async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.params;
  const { userId } = req.query;

  try {
    const result = await getCourseDetailInfo(courseId);

    const foundCourse = await Course.findOne({
      _id: courseId,
    });

    let isBought = false;

    if (userId) {
      const orders = await Order.find({ "user._id": userId, status: "Success" });

      const userCourses = orders.reduce((courses: ICourse[], order: IOrder) => {
        return courses.concat(order.items);
      }, []);

      const userCourseIds = userCourses.map((course: ICourse) => course._id.toString());

      isBought = userCourseIds.includes(courseId);
    }

    res.status(200).json({
      message: "Fetch single course successfully with and without user id!",
      course: {
        ...result,
        isBought,
      },
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch course!", 422);
      return next(customError);
    }
  }
};

export const getCoursesOrderedByUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const courses = await getCoursesOrderedByUserInfo(userId);

    res.status(200).json({
      message: "Fetch courses ordered by user successfully!",
      courses,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch course!", 422);
      return next(customError);
    }
  }
};

export const getRelatedCourses = async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.params;
  const userId = req.query.userId as string | undefined;
  let limit: string | undefined = req.query.limit as string | undefined;
  // create dict
  const dictCoursesOfUser: Record<string, any> = {};

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      const error = new CustomError("Course", "Course not found", 404);
      throw error;
    }

    limit = limit ? String(parseInt(limit)) : "5";

    const relatedCourses = await Course.find({
      _id: { $ne: courseId },
      categoryId: course.categoryId,
    })
      .populate("categoryId", "_id name")
      .populate("userId", "_id name avatar")
      .limit(parseInt(limit));

    if (!userId) {
      return res.status(200).json({
        message: "List of related courses",
        relatedCourses,
      });
    }
    const ordersRes = await Order.find({
      status: "Success"
    });

    const orderDetails = ordersRes.flatMap((order) => {
      return order.items.map((item: any) => ({
        orderId: order._id,
        userId: order.user._id,
        userEmail: order.user.email,
        // ... other relevant order fields if needed
        courseId: item._id,
        courseName: item.name,
        courseThumbnail: item.thumbnail,
        coursePrice: item.finalPrice,
        reviewed: item.reviewed,
      }));
    });

    // create dict courses of user
    orderDetails.forEach((item) => {
      if (item.userId) {
        if (dictCoursesOfUser[item.userId]) {
          dictCoursesOfUser[item.userId].push(item);
        } else {
          dictCoursesOfUser[item.userId] = [item];
        }
      }
    });

    const coursesOfUser = dictCoursesOfUser[userId] || [];
    const courseIdOfUserList = [
      ...new Set<string>(coursesOfUser.map((course) => course.courseId.toString())),
    ];

    let result = relatedCourses.map((course) => {
      return {
        ...course.toObject(),
        isBought: courseIdOfUserList.includes(course._id.toString()),
      };
    });

    res.status(200).json({
      message: "List of related courses",
      relatedCourses: result,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch courses!", 422);
      return next(customError);
    }
  }
};

export const getSuggestedCourses = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId as string;
  let limit: number = req.query.limit ? parseInt(req.query.limit as string) : 5;
  const dictCoursesOfUser: Record<string, any> = {};
  const dictCourse: Record<string, any> = {};
  const dictReviewsOfCourse: Record<string, any> = {};
  const dictUsersOfCourse: Record<string, any> = {};

  try {
    const ordersRes = await Order.find({
      status: "Success"
    });
    const courseRes = await Course.find();
    const reviewsRes = await Review.find();
    const orderDetails = ordersRes.flatMap((order) => {
      return order.items.map((item: any) => ({
        orderId: order._id,
        userId: order.user._id,
        userEmail: order.user.email,
        // ... other relevant order fields if needed

        courseId: item._id,
        courseName: item.name,
        courseThumbnail: item.thumbnail,
        coursePrice: item.finalPrice,
        reviewed: item.reviewed,
      }));
    });
    // create dict courses of user
    orderDetails.forEach((item) => {
      if (item.userId) {
        if (dictCoursesOfUser[item.userId]) {
          dictCoursesOfUser[item.userId].push(item);
        } else {
          dictCoursesOfUser[item.userId] = [item];
        }
      }

      if (item.courseId) {
        if (dictUsersOfCourse[item.courseId]) {
          dictUsersOfCourse[item.courseId].push(item);
        } else {
          dictUsersOfCourse[item.courseId] = [item];
        }
      }
    });

    // create dict course
    courseRes.forEach((item) => {
      const currentKey = item._id.toString();
      dictCourse[currentKey] = item;
    });

    reviewsRes.forEach((reviewItem) => {
      if (reviewItem.courseId) {
        const currentKey = reviewItem.courseId.toString();
        if (dictReviewsOfCourse[currentKey]) {
          dictReviewsOfCourse[currentKey].push(reviewItem);
        } else {
          dictReviewsOfCourse[currentKey] = [reviewItem];
        }
      }
    });

    const listCourseOfCurrentUser = dictCoursesOfUser[userId] || [];
    const boughtCourseId = [
      ...new Set<string>(listCourseOfCurrentUser.map((course) => course.courseId.toString())),
    ];

    const boughtCourses = [];

    boughtCourseId.forEach((courseId: string) => {
      if (dictCourse[courseId]) {
        boughtCourses.push(dictCourse[courseId]);
      }
    });

    if (!boughtCourses.length) {
      return res.status(200).json({
        message: "No suggestions available as no courses have been purchased.",
        suggestedCourses: [],
      });
    }

    const boughtCourseCategories = boughtCourses.map((course) => {
      const currentCateId = course.categoryId.toString();
      return currentCateId;
    });

    let courseIdOfUserList: string[] = [];
    if (typeof userId === "string" && userId.trim() !== "") {
      const listCourseOfUser = dictCoursesOfUser[userId] ?? [];
      let listCourseIdOfUser = [];
      
      if (listCourseOfUser.length > 0) {
        listCourseIdOfUser = listCourseOfUser.map((course: any) => course.courseId.toString());
        courseIdOfUserList = [...new Set<string>(listCourseIdOfUser)];
      } else {
        courseIdOfUserList = [];
      }
    }


    // Suggest the difficulties of the same list in purchased courses and other courses!
    const suggestedCourses = await Course.find({
      categoryId: { $in: boughtCourseCategories },
      _id: { $nin: boughtCourses.map((course) => course._id) },
    })
      .populate("categoryId", "_id name")
      .populate("userId", "_id name avatar")
      .limit(limit);

    const suggestedCoursesRes = [];
    for (const course of suggestedCourses) {
      const currentCourseId = course._id.toString();
      const listReviewsOfCurrentCourse = dictReviewsOfCourse[currentCourseId] ?? [];
      const listUsersOfCurrentCourse = dictUsersOfCourse[currentCourseId] ?? [];

      let avgRatings = 0;
      if (listReviewsOfCurrentCourse.length > 0) {
        avgRatings =
          listReviewsOfCurrentCourse.reduce(
            (total, review) => total + (review?.ratingStar || 0),
            0
          ) / listReviewsOfCurrentCourse.length;
      }

      const courseItem = {
        ...course.toObject(),
        avgRatings: avgRatings,
        numberUsersOfCourse: listUsersOfCurrentCourse.length,
        isBought: courseIdOfUserList.includes(currentCourseId)
      };
      suggestedCoursesRes.push(courseItem);
    }

    res.status(200).json({
      message: "List of suggested courses",
      suggestedCourses: suggestedCoursesRes,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch courses!", 422);
      return next(customError);
    }
  }
};

export const getCourseIdsFromWishlistByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const wishlists = await Wishlist.find({ userId, isDeleted: false });
    const courseIds = wishlists.map((wishlist) => wishlist.courseId);

    res.status(200).json({
      message: "Wishlist retrieved successfully",
      data: courseIds,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to retrieve wishlist", 422);
      return next(customError);
    }
  }
};

export const getCoursesFromWishlistByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const dictCoursesOfUser: Record<string, any> = {};

  try {
    const { userId } = req.params;

    const ordersRes = await Order.find({
      status: "Success"
    });
    const courseRes = await Course.find();
    const orderDetails = ordersRes.flatMap((order) => {
      return order.items.map((item: any) => ({
        orderId: order._id,
        userId: order.user._id,
        userEmail: order.user.email,
        // ... other relevant order fields if needed

        courseId: item._id,
        courseName: item.name,
        courseThumbnail: item.thumbnail,
        coursePrice: item.finalPrice,
        reviewed: item.reviewed,
      }));
    });
    // create dict courses of user
    orderDetails.forEach((item) => {
      if (item.userId) {
        if (dictCoursesOfUser[item.userId]) {
          dictCoursesOfUser[item.userId].push(item);
        } else {
          dictCoursesOfUser[item.userId] = [item];
        }
      }
    });

    const wishlists = await Wishlist.find({ userId, isDeleted: false });
    const courseIdsFromWishlist = wishlists.map((wishlist) => wishlist.courseId);

    const courses = await Course.find({
      _id: { $in: courseIdsFromWishlist },
    })
      .populate("categoryId", "_id name")
      .populate("userId", "_id name avatar");

    const coursesOfUser = dictCoursesOfUser[userId] ?? [];
    const courseIdOfUserList = [
      ...new Set(coursesOfUser.map((course) => course.courseId.toString())),
    ];

    const result = courses.map((course) => {
      return {
        ...course.toObject(),
        isBought: courseIdOfUserList.includes(course._id.toString()),
      };
    });

    res.status(200).json({
      message: "Courses retrieved from wishlist successfully",
      courses: result,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to retrieve courses from wishlist", 422);
      return next(customError);
    }
  }
};

export const increaseCourseView = async (req: Request, res: Response, next: NextFunction) => {
  const courseId = req.params.courseId;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      const error = new CustomError("Course", ERROR_NOT_FOUND_DATA, 404);
      throw error;
    }

    course.views += 1;
    await course.save();

    res.json({ message: UPDATE_SUCCESS });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage(ERROR_UPDATE_DATA, 422);
      return next(customError);
    }
  }
};

export const getUsersByCourseId = async (req: Request, res: Response, next: NextFunction) => {
  const courseId = req.params.courseId;

  try {
    const orders = await Order.find({ "items._id": courseId, status: "Success" }).sort({ createdAt: -1 });

    const users = orders.map((order) => order.user);
    const uniqueUsers = users.reduce((acc, user) => {
      if (!acc.find((u) => u._id.toString() === user._id.toString())) {
        acc.push(user);
      }
      return acc;
    }, []);

    res.status(200).json({
      message: "Fetch users by course id successfully!",
      users: uniqueUsers,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage(ERROR_GET_DATA, 422);
      return next(customError);
    }
  }
};

import { Request, Response, NextFunction } from "express";
import Category from "../../models/Category";
import { getCourseDetailInfo } from "../../utils/helper";
import Course, { ICourse } from "../../models/Course";
import Section, { ISection } from "../../models/Section";
import Review from "../../models/Review";
import Lesson, { ILesson } from "../../models/Lesson";
import IsLessonDone from "../../models/IsLessonDone";
import Order, { IOrder } from "../../models/Order";
import { getCoursesOrderedByUserInfo } from "../../utils/helper";
import CustomError from "../../utils/error";
import CustomErrorMessage from "../../utils/errorMessage";

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
  const { _limit, _sort, _page, userId } = req.query;

  let limit = parseInt(_limit as string);
  let page = parseInt(_page as string);

  limit = limit > 0 ? limit : 12;
  page = page > 0 ? page : 1;

  const skip = (page - 1) * limit;

  try {
    const query = buildQuery(req);

    const coursesQuery = Course.find(query, {
      ...(query.$text && { score: { $meta: "textScore" } }),
    })
      .populate("categoryId", "_id name")
      .populate("userId", "_id name avatar")
      .skip(skip)
      .limit(limit);

    if (_sort) {
      let sortQuery: SortQuery = {
        ...(query.$text && { score: { $meta: "textScore" } }),
      };

      if (_sort === "newest") {
        sortQuery.createdAt = -1;
      }

      coursesQuery.sort(sortQuery);
    }

    const totalCourses = await Course.where(query).countDocuments();
    const courses: ICourse[] = await coursesQuery;

    let courseIdOfUserList: string[] = [];
    if (typeof userId === "string" && userId.trim() !== "") {
      const coursesOfUser: ICourse[] = await getCoursesOrderedByUserInfo(userId);
      courseIdOfUserList = coursesOfUser.map((course) => course._id.toString());
    }

    let result: Array<ICourse & { isBought: boolean }> = [];

    for (const course of courses) {
      const courseItem = {
        ...course.toObject(),
        isBought:
          typeof userId === "string" && userId.trim() !== ""
            ? courseIdOfUserList.includes(course._id.toString())
            : false,
      };
      result.push(courseItem);
    }

    res.status(200).json({
      message: "Fetch all courses successfully!",
      courses: result,
      pagination: {
        _page: page,
        _limit: limit,
        _totalRows: totalCourses,
      },
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
      { $limit: limit },
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
      const customError = new CustomErrorMessage("ailed to fetch popular courses!", 422);
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

    let isBought = false;

    if (userId) {
      const orders = await Order.find({ "user._id": userId });

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

export const postReview = async (req: Request, res: Response, next: NextFunction) => {
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
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to created review!", 422);
      return next(customError);
    }
  }
};

export const getRelatedCourses = async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.params;
  const userId = req.query.userId as string | undefined;
  let limit: string | undefined = req.query.limit as string | undefined;

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

    const coursesOfUser = await getCoursesOrderedByUserInfo(userId);
    const courseIdOfUserList = coursesOfUser.map((course) => course._id.toString());

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

  try {
    const boughtCourses = await getCoursesOrderedByUserInfo(userId);

    if (!boughtCourses.length) {
      return res.status(200).json({
        message: "No suggestions available as no courses have been purchased.",
        suggestedCourses: [],
      });
    }

    const boughtCourseCategories = boughtCourses.map((course) => course.categoryId.toString());

    const suggestedCourses = await Course.find({
      categoryId: { $in: boughtCourseCategories },
      _id: { $nin: boughtCourses.map((course) => course._id) },
    })
      .populate("categoryId", "_id name")
      .populate("userId", "_id name avatar")
      .limit(limit);

    res.status(200).json({
      message: "List of suggested courses",
      suggestedCourses,
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

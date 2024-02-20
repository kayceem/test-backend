import { Request, Response, NextFunction } from "express";
import Course from "../../models/Course";
import { ICourse } from "../../types/course.type";
import CustomError from "../../utils/error";
import CustomErrorMessage from "../../utils/errorMessage";
interface GetCoursesQuery {
  $text?: { $search: string };
  userId?: { $in: string[] };
  categoryId?: string;
}

export const getCourses = async (req: Request, res: Response, next: NextFunction) => {
  const { _q, _page, _limit, _author, _category } = req.query;

  const skip: number = ((+_page || 1) - 1) * +_limit;

  const query: GetCoursesQuery = {};

  if (_q && typeof _q === "string") {
    query.$text = { $search: _q };
  }

  if (_author && typeof _author === "string" && _author !== "all") {
    query.userId = {
      $in: _author.split(","),
    };
  }

  if (_category && typeof _category === "string" && _category !== "all") {
    query.categoryId = _category;
  }

  try {
    const promiseCourses = Course.find(query, {
      ...(query.$text && { score: { $meta: "textScore" } }),
    })
      .populate("categoryId", "_id name")
      .populate("userId", "_id name avatar");

    let courses: ICourse[];

    if (_limit && _page) {
      courses = await promiseCourses.skip(skip).limit(+_limit);
    } else {
      courses = await promiseCourses;
    }

    const totalCourses: number = await Course.where(query).countDocuments();

    const pagination = {
      _page: +_page || 1,
      _limit: +_limit || 8,
      _totalRows: totalCourses,
    };

    res.status(200).json({
      message: "Fetch all courses successfully!",
      courses,
      pagination,
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

export const getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
  const _q: string = req.query._q as string;

  const query: GetCoursesQuery = {};

  if (_q) {
    query.$text = { $search: _q };
  }

  try {
    const courses = await Course.find(query, {
      ...(query.$text && { score: { $meta: "textScore" } }),
    })
      .populate("categoryId", "_id name")
      .populate("userId", "_id name avatar");

    res.status(200).json({
      message: "Fetch all Courses successfully!",
      courses,
      pagination: {
        _totalRows: courses.length,
      },
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch all courses!", 422);
      return next(customError);
    }
  }
};

export const getCourse = async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId)
      .populate("categoryId", "_id name")
      .populate("userId", "_id name");

    res.status(200).json({
      message: "Fetch single course successfully!",
      course,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch course by id!", 422);
      return next(customError);
    }
  }
};

export const postCourse = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    thumbnail,
    access,
    price,
    finalPrice,
    description,
    level,
    categoryId,
    userId,
    courseSlug,
    willLearns,
    subTitle,
  } = req.body;

  try {
    const course = new Course({
      name,
      thumbnail,
      access,
      price,
      finalPrice,
      description,
      level,
      courseSlug,
      categoryId,
      userId,
      willLearns,
      subTitle,
    });

    const response = await course.save();

    res.json({
      message: "Create course successfully!",
      course: response,
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

export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.params;

  try {
    const response = await Course.deleteOne({
      _id: courseId,
    });

    res.json({
      message: "Delete course successfully!",
      courseId: courseId,
      result: response,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to delete courses!", 422);
      return next(customError);
    }
  }
};

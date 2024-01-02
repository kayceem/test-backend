const { faker } = require("@faker-js/faker");
const Category = require("../models/Category");
const Course = require("../models/Course");
const { deleteFile } = require("../utils/file");
const { validationResult } = require("express-validator");
import CustomErrorMessage from "../utils/errorMessage";
import { Request, Response, NextFunction } from "express";
export const getCourses = async (req: Request, res: Response, next: NextFunction) => {
  const { _q, _page, _limit, _author, _category } = req.query;

  const skip = ((+_page || 1) - 1) * (+_limit);

  const query: any = {};

  if (_q) {
    query.$text = { $search: _q };
  }

  if (_author && _author !== "all") {
    query.userId = {
      $in: (_author as string).split(","),
    };
  }

  if (_category && _category !== "all") {
    query.categoryId = _category;
  }

  try {
    const promiseCourses = Course.find(query, {
      ...(query.$text && { score: { $meta: "textScore" } }),
    })
      .populate("categoryId", "_id name")
      .populate("userId", "_id name avatar");
    // courses will now contain the desired result with specific fields from the referenced documents

    let courses = [];
    if (_limit && _page) {
      courses = await promiseCourses.skip(skip).limit(_limit);
    } else {
      courses = await promiseCourses;
    }

    const totalCourses = await Course.where(query).countDocuments();

    const pagination = {
      _page: +_page || 1,
      _limit: +_limit || 8,
      _totalRows: totalCourses,
    };

    res.status(200).json({
      message: "Fetch all Courses successfully!",
      courses: courses,
      pagination,
    });
  } catch (error: any) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch Courses!", 422);
      return error;
    }
    next(error);
  }
};

export const getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
  const { _q } = req.query;

  const query: any = {};

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
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch all courses", 422);
      return error;
    }
    next(error);
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
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch course by id!", 422);
      return error;
    }
    next(error);
  }
};

export const createRandomCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find();
    const randNumber = Math.trunc(Math.random() * 3);
    const randNumberDiscount = Math.trunc(Math.random() * 10);

    let result = [];

    for (let i = 0; i < 10; i++) {
      const courseData = {
        name: faker.commerce.courseName(),
        oldPrice: faker.commerce.price({ min: 100, max: 200 }),
        discount: randNumberDiscount,
        images: new Array(5)
          .fill(faker.image.urlLoremFlickr({ width: 358, height: 358, category: "technology" }))
          .join(","),
        shortDesc: faker.commerce.courseDescription(),
        fullDesc: faker.commerce.courseDescription(),
        stockQty: 100,
        categoryId: categories.map((cate: {_id: string}) => cate._id)[randNumber],
        thumbnail: faker.image.urlLoremFlickr({ width: 358, height: 358, category: "technology" }),
        views: 100,
      };

      const newCourse = new Course(courseData);

      await newCourse.save();

      result.push(courseData);
    }

    res.status(200).json({
      message: "Get random Courses success !!!",
      result,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to create random Courses!", 422);
      return error;
    }
    next(error);
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
    tags,
    requirements,
  } = req.body;
  // const images = req.files.map((item) => item.path.replace("\\", "/"));
  // const thumb = images.find((image) => image.includes("thumb"));

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
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch Courses!", 422);
      return error;
    }
    next(error);
  }
};

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  const { name, oldPrice, discount, oldImages, shortDesc, fullDesc, stockQty, categoryId } =
    req.body;
  const { cousreId } = req.params;

  const images = (req.files as any).map((item: any) => item.path.replace("\\", "/"));
  const imageStrings = images.join(", ");
  const thumb = images.find((image: any) => image.includes("thumb"));

  const isEmptyFiles = req.files.length === 0;
  const isDifferentImages = imageStrings !== oldImages;

  // if (req.files.length > 0) {
  // }

  // if (isDifferentImages && !isEmptyFiles) {
  // }

  // return;
  try {
    // Find course by id
    const course = await Course.findById(cousreId);

    // Update course follow by that id
    course.name = name;
    course.oldPrice = +oldPrice;
    course.discount = +discount;

    // Trường hợp không up ảnh nào thì sao ???
    if (isDifferentImages && !isEmptyFiles) {
      course.images = imageStrings;
      course.thumbnail = thumb;

      oldImages?.split(", ").forEach((image: string) => {
        deleteFile(image);
      });
    }

    course.shortDesc = shortDesc;
    course.fullDesc = fullDesc;
    course.stockQty = +stockQty;
    course.categoryId = categoryId;

    const response = await course.save();

    res.json({
      message: "Update course successfully!",
      course: response,
    });

    if (isDifferentImages && !isEmptyFiles) {
      // Delete images from source
    }
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch Courses!", 422);
      return error;
    }
    next(error);
  }
};

export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.params;

  try {
    // const { images } = await Course.findById(courseId);
    const response = await Course.deleteOne({
      _id: courseId,
    });

    res.json({
      message: "Delete course successfully!",
      courseId: courseId,
      result: response,
    });

    // Loop and Delete course images from images folder source
    // images?.split(", ").forEach((image) => {
    //   deleteFile(image);
    // });
  } catch (error) {
                         
    next(error);
  }
};


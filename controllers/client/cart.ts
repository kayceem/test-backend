import { Request, Response, NextFunction } from "express";
import Course from "../../models/Course";
import { getCourseDetailInfo } from "../../utils/helper";
import CustomError from "../../utils/error";
import CustomErrorMessage from "../../utils/errorMessage";

export const retrieveCartByIds = async (req: Request, res: Response, next: NextFunction) => {
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
    const courseIdsArray =
      typeof _courseIds === "string"
        ? _courseIds.split(",").map((id) => id.trim())
        : ([] as string[]);

    const courses = await Course.find({
      _id: { $in: courseIdsArray },
    }).select("_id name finalPrice thumbnail userId level");

    const totalPrice = courses.reduce((acc, course) => acc + course.finalPrice, 0);

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
      message: "Fetch cart by course ids list successfully!",
      cart: {
        items: result,
        totalPrice: totalPrice,
      },
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to retrieve cart from database", 422);
      return next(customError);
    }
  }
};

import { Request, Response, NextFunction } from "express";
import CustomErrorMessage from "./errorMessage";
import CustomError from "./error";
import Order from "../models/Order";
import User from "../models/User";
import { IOrder } from "../types/order.type";
import Course from "../models/Course";
import { ICourse, ICourseDetail } from "../types/course.type";
import Review from "../models/Review";
import Section from "../models/Section";
import { ISection } from "../types/section.type";
import Lesson from "../models/Lesson";
import { ILesson, IIsLessonDone } from "../types/lesson.type";
import IsLessonDone from "../models/IsLessonDone";
import { COUPON_TYPES } from "../config/constant";
import { ICoupon } from "../types/coupon.type";


export const getProgressOfCourse = async (courseId: string, userId: string) => {
  const sectionsOfCourse: ISection[] = await Section.find({
    courseId,
  });

  let numOfLessonDone: number = 0;
  let totalVideosLengthDone: number = 0;
  let lessonsOfCourse: ILesson[] = [];

  for (const section of sectionsOfCourse) {
    const lessons: ILesson[] = await Lesson.find({
      sectionId: section._id,
    });
    lessonsOfCourse.push(...lessons);
  }

  for (const lesson of lessonsOfCourse) {
    const isDone: IIsLessonDone | null = await IsLessonDone.findOne({
      userId,
      lessonId: lesson._id,
    });
    // const isDone: IIsLessonDone | null = dictLessonDone[userId.toString() + lesson._id.toString()]

    if (isDone) {
      numOfLessonDone += 1;
      totalVideosLengthDone += lesson.videoLength;
    }
  }

  const numOfLessons: number = lessonsOfCourse.length;

  let progress: number = numOfLessons === 0 ? 0 : numOfLessonDone / numOfLessons;

  return {
    progress,
    totalVideosLengthDone,
  };
};

export const getCoursesOrderByUserId = async (userId: string) => {
  const courses = await Order.find({
    "user._id": userId,
    status: "Success"
  })
    .select("items")
    .populate("items._id");

  const results = courses
    .map((courseItem) => {
      return courseItem.items;
    })
    .flat()
    .map((item) => item._id);

  return results;
};

export const getCourseDetailInfo = async (courseId: string): Promise<ICourseDetail> => {
  const dictSectionOfCourse: Record<string, any> = {};
  const dictLessonsOfCourse: Record<string, any> = {};
  const dictLessonsOfSection: Record<string, any> = {};

  try {
    const course = (await Course.findById(courseId)
      .populate("categoryId", "_id name")
      .populate("createdBy", "_id name avatar")) as ICourseDetail;

    const sectionsOfCurrentCourseRes = (await Section.find({ courseId })) as ISection[];
    const lessonsRes = await Lesson.find();

    lessonsRes.forEach((item) => {
      const currentKey = item.sectionId.toString();
      if (dictLessonsOfSection[currentKey]) {
        dictLessonsOfSection[currentKey].push(item);
      } else {
        dictLessonsOfSection[currentKey] = [item];
      }
    });

    sectionsOfCurrentCourseRes.forEach((item) => {
      const currentCourseKey = item.courseId.toString();
      const currentSectionId = item._id.toString();
      const listLessonOfCurrentSection = dictLessonsOfSection[currentSectionId] ?? [];
      listLessonOfCurrentSection.forEach((item) => {
        if (dictLessonsOfCourse[currentCourseKey]) {
          dictLessonsOfCourse[currentCourseKey].push(item);
        } else {
          dictLessonsOfCourse[currentCourseKey] = [item];
        }
      });
    });

    const lessonsOfCourse = (dictLessonsOfCourse[course._id.toString()] as ILesson[]) ?? [];

    const orders = (await Order.find({ "items._id": courseId, status: "Success" })) as IOrder[];
    const numOfStudents = orders.length;

    const totalVideosLength = lessonsOfCourse.reduce(
      (acc, lesson) => acc + (lesson.videoLength || 0),
      0
    );

    const reviews = await Review.find({ courseId });

    const avgRatingStars =
      reviews.reduce((acc, review) => acc + review.ratingStar, 0) / reviews.length || 0;

    const userInfo = await User.findById(course.userId?._id);
    const userBiography = userInfo?.biography || "No biography available";

    const result: ICourseDetail = {
      _id: course._id,
      name: course.name,
      price: course.price,
      finalPrice: course.finalPrice,
      thumbnail: course.thumbnail,
      access: course.access,
      views: course.views,
      willLearns: course.willLearns,
      description: course.description,
      // The course is not in the category that is easy to get errors!
      categoryId: {
        _id: course?.categoryId?._id,
        name: course?.categoryId?.name,
      },
      userId: {
        _id: course?.userId?._id,
        name: course?.userId?.name,
        avatar: course?.userId?.avatar,
      },
      authorId: {
        _id: course?.createdBy?._id,
        name: course?.createdBy?.name,
        avatar: course?.createdBy?.avatar,
        biography: userBiography,
      },
      // UserId here meaning an author! Remove later!
      courseSlug: course?.courseSlug,
      level: course.level,
      sections: sectionsOfCurrentCourseRes.length, // TODO LATER
      lessons: lessonsOfCourse.length,
      students: numOfStudents,
      totalVideosLength,
      numOfReviews: reviews.length,
      avgRatingStars,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };

    return result;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    } else {
      const customError = new CustomErrorMessage("Failed to fetch courses!", 422);
      throw customError;
    }
  }
};

export const getCoursesOrderedByUserInfo = async (userId: string): Promise<ICourse[]> => {
  try {
    const orders = (await Order.find({
      "user._id": userId,
      status: "Success",
    })
      .select("items")
      .populate("items._id")) as IOrder[];

    const courses = orders.flatMap((order) => order.items).map((item) => item._id as ICourse);

    return courses;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    } else {
      const customError = new CustomErrorMessage("Failed to fetch courses!", 422);
      throw customError;
    }
  }
};

export const calculateTotalPrice = async (courseIdArray: string[]) => {
  let totalPrice = 0;
  try {
    const courses = await Course.find({ _id: { $in: courseIdArray } }).select("finalPrice");

    courses.forEach((course) => {
      totalPrice += course.finalPrice;
    });
    return totalPrice;
  } catch (error) {
    throw new Error("Error calculating total price");
  }
};

export const getMaxDiscountCoupon = (totalPrice: number, coupons: ICoupon[]) => {
  let maxPercentDiscount = 0;
  let maxFixedAmountDiscount = 0;
  let maxPercentDiscountCoupon: ICoupon | null = null;
  let maxFixedDiscountCoupon: ICoupon | null = null;

  coupons.forEach((coupon) => {
    const couponTypeIdString = String(coupon.couponTypeId);

    if (couponTypeIdString === COUPON_TYPES.COUPON_TYPE_PERCENT) {
      if (coupon.discountAmount > maxPercentDiscount) {
        maxPercentDiscount = coupon.discountAmount;
        maxPercentDiscountCoupon = coupon;
      }
    } else if (couponTypeIdString === COUPON_TYPES.COUPON_TYPE_FIXED_AMOUNT) {
      if (coupon.discountAmount > maxFixedAmountDiscount) {
        maxFixedAmountDiscount = coupon.discountAmount;
        maxFixedDiscountCoupon = coupon;
      }
    }
  });

  if (maxPercentDiscount === 0) {
    return maxFixedDiscountCoupon;
  } else if (maxFixedAmountDiscount === 0) {
    return maxPercentDiscountCoupon;
  }

  maxPercentDiscount = (totalPrice * maxPercentDiscount) / 100;

  const percentDiscountedPrice = totalPrice - maxPercentDiscount;
  const fixedAmountDiscountedPrice = totalPrice - maxFixedAmountDiscount;

  if (percentDiscountedPrice < fixedAmountDiscountedPrice) {
    return maxPercentDiscountCoupon;
  } else {
    return maxFixedDiscountCoupon;
  }
};

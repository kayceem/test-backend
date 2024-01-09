import faker from "@faker-js/faker";
import Category from "../models/Category";
import Course from "../models/Course";
import Section from "../models/Section";
const { deleteFile } = require("../utils/file");
import validationResult from "express-validator";
import CustomErrorMessage from "../utils/errorMessage";
import { Request, Response, NextFunction } from "express";

export const getSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sections = await Section.find();
    res.status(200).json({
      message: "Fetch all Sections successfully!",
      sections,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch Sections!", 422);
      return error;
    }
    next(error);
  }
};

export const getSectionsByCourseId = async (req: Request, res: Response, next: NextFunction) => {
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

export const getSection = async (req: Request, res: Response, next: NextFunction) => {
  const { sectionId } = req.params;

  try {
    const section = await Section.findById(sectionId).populate("courseId");
    res.status(200).json({
      message: "Fetch single section successfully!",
      section,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch Section by id!", 422);
      return error;
    }
    next(error);
  }
};

export const postSection = async (req: Request, res: Response, next: NextFunction) => {
  const { courseId, name, access, description } = req.body;

  // const images = req.files.map((item) => item.path.replace("\\", "/"));
  // const thumb = images.find((image) => image.includes("thumb"));

  try {
    const section = new Section({
      courseId,
      name,
      access,
      description,
    });

    const response = await section.save();

    res.json({
      message: "Create Section successfully!",
      Section: response,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to post section!", 422);
      return error;
    }
    next(error);
  }
};

export const updateSection = async (req: Request, res: Response, next: NextFunction) => {
  const { name, oldPrice, discount, oldImages, shortDesc, fullDesc, stockQty, categoryId } =
    req.body;
  const { cousreId } = req.params;

  const images = (req.files as any).map((item: any) => item.path.replace("\\", "/"));
  const imageStrings = images.join(", ");
  const thumb = images.find((image: any) => image.includes("thumb"));

  const isEmptyFiles = req.files.length === 0;
  const isDifferentImages = imageStrings !== oldImages;

  try {
    // Find course by id
    const course = await Section.findById(cousreId);

    // Update course follow by that id
    course.name = name;
    course.oldPrice = +oldPrice;
    course.discount = +discount;

    // Trường hợp không up ảnh nào thì sao ???
    if (isDifferentImages && !isEmptyFiles) {
      course.images = imageStrings;
      course.thumbnail = thumb;

      oldImages?.split(", ").forEach((image: any) => {
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
      const error = new CustomErrorMessage("Failed to fetch Sections!", 422);
      return error;
    }
    next(error);
  }
};

export const deleteSection = async (req: Request, res: Response, next: NextFunction) => {
  const { sectionId } = req.params;

  try {
    // const { images } = await Course.findById(sectionId);
    const response = await Course.deleteOne({
      _id: sectionId,
    });

    res.json({
      message: "Delete course successfully!",
      sectionId: sectionId,
      result: response,
    });

    // Loop and Delete course images from images folder source
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to delete course!", 422);
      return error;
    }
    next(error);
  }
};

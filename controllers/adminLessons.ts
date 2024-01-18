const { faker } = require("@faker-js/faker");
const Category = require("../models/Category");
import Lesson from "../models/Lesson";
const { deleteFile } = require("../utils/file");
const { validationResult } = require("express-validator");
const IsLessonDone = require("../models/IsLessonDone");
import CustomErrorMessage from "../utils/errorMessage";
import { Request, Response, NextFunction } from "express";

export const getAllLessons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lessons = await Lesson.find();
    res.status(200).json({
      message: "Fetch all lessons successfully!",
      lessons,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch lessons!", 422);
      return error;
    }
    next(error);
  }
};

export const getLessonsBySectionId = async (req: Request, res: Response, next: NextFunction) => {
  const { sectionId } = req.params;

  try {
    const lessonsOfSection = await Lesson.find({
      sectionId: sectionId,
    });
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

export const getSingleLesson = async (req: Request, res: Response, next: NextFunction) => {
  const { lessonId } = req.params;

  try {
    const lesson = await Lesson.findById(lessonId);
    res.status(200).json({
      message: "Fetch single Lesson successfully!",
      lesson,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch Lesson by id!", 422);
      return error;
    }
    next(error);
  }
};

export const createLesson = async (req: Request, res: Response, next: NextFunction) => {
  const { sectionId, name, icon, description, type, content, access, password, videoLength } =
    req.body;

  // const images = req.files.map((item) => item.path.replace("\\", "/"));
  // const thumb = images.find((image) => image.includes("thumb"));

  try {
    const lesson = new Lesson({
      sectionId,
      name,
      icon,
      description,
      content,
      access,
      type,
      videoLength,
    });

    const response = await lesson.save();

    res.json({
      message: "Create Lesson successfully!",
      lesson: response,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to post lesson!", 422);
      return error;
    }
    next(error);
  }
};

export const updateLesson = async (req: Request, res: Response, next: NextFunction) => {
  const { name, oldPrice, discount, oldImages, shortDesc, fullDesc, stockQty, categoryId } =
    req.body;
  const { lessonId } = req.params;

  const images = (req.files as any).map((item: any) => item.path.replace("\\", "/"));
  const imageStrings = images.join(", ");
  const thumb = images.find((image: any) => image.includes("thumb"));

  const isEmptyFiles = req.files.length === 0;
  const isDifferentImages = imageStrings !== oldImages;

  // return;
  try {
    // Find Lesson by id
    const lesson = await Lesson.findById(lessonId);

    // Update lesson follow by that id
    lesson.name = name;
    lesson.oldPrice = +oldPrice;
    lesson.discount = +discount;

    // Trường hợp không up ảnh nào thì sao ???
    if (isDifferentImages && !isEmptyFiles) {
      lesson.images = imageStrings;
      lesson.thumbnail = thumb;

      oldImages?.split(", ").forEach((image: string[]) => {
        deleteFile(image);
      });
    }

    lesson.shortDesc = shortDesc;
    lesson.fullDesc = fullDesc;
    lesson.stockQty = +stockQty;
    lesson.categoryId = categoryId;

    const response = await lesson.save();

    res.json({
      message: "Update lesson successfully!",
      lesson: response,
    });

    if (isDifferentImages && !isEmptyFiles) {
      // Delete images from source
    }
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch Lessons!", 422);
      return error;
    }
    next(error);
  }
};

export const deleteLesson = async (req: Request, res: Response, next: NextFunction) => {
  const { lessonId } = req.params;

  try {
    const { images } = await Lesson.findById(lessonId);
    const response = await Lesson.deleteOne({
      _id: lessonId,
    });

    res.json({
      message: "Delete Lesson successfully!",
      lessonId: lessonId,
      result: response,
    });

    // Loop and Delete Lesson images from images folder source
    images?.split(", ").forEach((image: string) => {
      deleteFile(image);
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to delete Lesson!", 422);
      return error;
    }
    next(error);
  }
};

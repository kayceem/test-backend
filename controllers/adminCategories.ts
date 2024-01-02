// const Category = require("../models/Category");
import Category from "../models/Category";
// const Course = require("../models/Course");
import Course from "../models/Course";
const { deleteFile } = require("../utils/file");
const { validationResult } = require("express-validator");
import CustomErrorMessage from "../utils/errorMessage";
import { Request, Response, NextFunction } from "express";

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  const { _q, _cateName } = req.query;

  const query: any = {};

  if (_q) {
    query.$text = { $search: _q };
  }

  if (_cateName && _cateName !== "all") {
    query.name = _cateName;
  }

  try {
    const categories = await Category.find(query, {
      ...(query.$text && { score: { $meta: "textScore" } }),
    });

    const finalCategories = categories.map(async (cate: any) => {
      try {
        const courses = await Course.countDocuments({
          categoryId: cate._id,
        });

        return {
          _id: cate._id,
          name: cate.name,
          cateImage: cate.cateImage,
          cateSlug: cate.cateSlug,
          description: cate.description,
          courses,
          createdAt: cate.createdAt,
          updatedAt: cate.updatedAt,
        };
      } catch (error) {
        if (!error) {
          const error = new CustomErrorMessage("Failed to fetch categories!", 422);
          return error;
        }
        next(error);
      }
    });

    res.status(200).json({
      message: "Fetch categories sucessfully!",
      categories: await Promise.all(finalCategories),
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch categories!", 422);
      return error;
    }
    next(error);
  }
};

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      message: "Fetch all categories sucessfully!",
      categories,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch all categories!", 422);
      return error;
    }
    next(error);
  }
};

export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findById(categoryId);
    res.status(200).json({
      message: "fetch single category successfully!",
      category,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch categories!", 422);
      return error;
    }
    next(error);
  }
};

export const postCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description } = req.body;

  const errors = validationResult(req);


  try {
    if (!errors.isEmpty()) {
      // Get the first error
      const validationError = new CustomErrorMessage(errors.errors[0].msg, 422);
      throw validationError;
    }

    const imageUrl = req.file ? req.file.path.replace("\\", "/") : "images/user-avatar.jpg";
    const category = new Category({ name, cateImage: imageUrl, description });
    const response = await category.save();
    res.status(201).json({
      message: "Create category succesfully!",
      category: response,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch categories!", 422);
      return error;
    }

    next(error);
  }
};

export const updateCategories = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, cateImage, cateSlug } = req.body;

  const { categoryId } = req.params;

  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      // Get the first error
      const validationError = new CustomErrorMessage(errors.errors[0].msg, 422);
      throw validationError;
    }

    
    const updatedCategory =  await Category.findById(categoryId);

    updatedCategory.name = name;
    updatedCategory.description = description;
    updatedCategory.cateSlug = cateSlug;
    updatedCategory.cateImage = cateImage;

    const response = await updatedCategory.save();

    res.status(200).json({
      message: "Update category succesfully!",
      category: response,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to fetch categories!", 422);
      return error;
    }
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { categoryId } = req.params;
  try {
    // const { cateImage } = await Category.findById(categoryId);
    const response = await Category.deleteOne({
      _id: categoryId,
    });
    res.status(200).json({
      message: "Category deleted successfully!",
      categoryId: categoryId,
    });

    // delete file when delete cate row
    // deleteFile(cateImage);
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to delete category by id!", 422);
      return error;
    }
    next(error);
  }
};

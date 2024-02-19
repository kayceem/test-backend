import { Request, Response } from "express";
import BlogCategory, { ICategoryBlog } from "../../models/BlogCategory";

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories: ICategoryBlog[] = await BlogCategory.find();
    res.json({ blogCategories: categories });
  } catch (err) {
    res
      .status(500)
      .json({ message: err instanceof Error ? err.message : "An unknown error occurred" });
  }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const category = await BlogCategory.findById(id);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.json({ blogCategory: category });
  } catch (err) {
    res
      .status(500)
      .json({ message: err instanceof Error ? err.message : "An unknown error occurred" });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const { name, description, cateImage } = req.body;
  if (!name || !description) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }
  try {
    const newCategory = new BlogCategory({ name, description, cateImage });
    await newCategory.save();
    res.status(201).json({ blogCategory: newCategory });
  } catch (err) {
    res
      .status(500)
      .json({ message: err instanceof Error ? err.message : "An unknown error occurred" });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedCategory = await BlogCategory.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCategory) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.json({ blogCategory: updatedCategory });
  } catch (err) {
    res
      .status(500)
      .json({ message: err instanceof Error ? err.message : "An unknown error occurred" });
  }
};

export const deleteCategoryById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const category = await BlogCategory.findById(id);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    await BlogCategory.findByIdAndRemove(id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "An unknown error occurred" });
  }
};

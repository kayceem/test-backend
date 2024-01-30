// controllers/categoryController.ts
import Category, { ICategory } from "../../models/BlogCategory";
import { Request, Response } from "express";

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories: ICategory[] = await Category.find();
    res.json(categories);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const category: ICategory | null = await Category.findById(id);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.json(category);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const category = req.body;
  try {
    const newCategory: ICategory = await Category.create(category);
    res.status(201).json(newCategory);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const category = req.body;
  try {
    const updatedCategory: ICategory | null = await Category.findByIdAndUpdate(id, category, {
      new: true,
    });
    if (!updatedCategory) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.json(updatedCategory);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const deleteCategoryById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const category: ICategory | null = await Category.findById(id);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    await Category.findByIdAndRemove(id);
    res.status(200).json({
      message: "Delete category successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "An unknown error occurred" });
  }
};

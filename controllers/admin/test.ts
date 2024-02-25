import { Request, Response, NextFunction } from "express";
import Test from "../../models/Test";
import CustomError from "../../utils/error";
import CustomErrorMessage from "../../utils/errorMessage";
import { AuthorAuthRequest } from "../../middleware/is-auth";


export const getTests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tests = await Test.find();

    res.status(200).json({
      message: "Fetch all tests successfully!",
      tests,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch tests!", 422);
      return next(customError);
    }
  }
};

export const getTestById = async (req: Request, res: Response, next: NextFunction) => {
  const { testId } = req.params;

  try {
    const test = await Test.findById(testId);

    res.status(200).json({
      message: "Fetch single Test successfully!",
      test,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch test by id!", 422);
      return next(customError);
    }
  }
};

export const postTest = async (req: AuthorAuthRequest, res: Response, next: NextFunction) => {
  const { sectionId, name, icon, description, type, content, access, videoLength } = req.body;

  try {
    const test = new Test({
      name,
      createdBy: req.userId
    });

    const response = await test.save();

    res.json({
      message: "Create Test successfully!",
      test: response,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to post test!", 422);
      return next(customError);
    }
  }
};

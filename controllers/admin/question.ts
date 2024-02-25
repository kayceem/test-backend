import { Request, Response, NextFunction } from "express";
import Question from "../../models/Question";
import CustomError from "../../utils/error";
import CustomErrorMessage from "../../utils/errorMessage";
import { AuthorAuthRequest } from "middleware/is-auth";

export const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questions = await Question.find();

    res.status(200).json({
      message: "Fetch all questions successfully!",
      questions,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch questions!", 422);
      return next(customError);
    }
  }
};

export const getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
  const { questionId } = req.params;

  try {
    const question = await Question.findById(questionId);

    res.status(200).json({
      message: "Fetch single Question successfully!",
      question,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch question by id!", 422);
      return next(customError);
    }
  }
};

export const postQuestion = async (req: AuthorAuthRequest, res: Response, next: NextFunction) => {
  const { sectionId, name, icon, description, type, content, access, videoLength } = req.body;

  try {
    const question = new Question({
      name,
      createdBy: req.userId
    });

    const response = await question.save();

    res.json({
      message: "Create Question successfully!",
      question: response,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to post question!", 422);
      return next(customError);
    }
  }
};

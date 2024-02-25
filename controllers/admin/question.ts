import { Request, Response, NextFunction, response } from "express";
import Question from "../../models/Question";
import CustomError from "../../utils/error";
import CustomErrorMessage from "../../utils/errorMessage";
import mongoose, {Types, ObjectId, ClientSession} from "mongoose";
import { coreHelper } from "../../utils/coreHelper";
import ActionLog from "../../models/ActionLog";
import { enumData } from "../../config/enumData";
import { AuthorAuthRequest } from "../../middleware/is-auth";

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
  const { name, listAnswersOfQuestion, correctAnswer } = req.body;
  let session: ClientSession | null = null;
  session = await mongoose.startSession();
  session.startTransaction();
  try {
    const question = new Question({
      name,
      code: coreHelper.getCodeDefault('QUESTION', Question),
      listAnswersOfQuestion: listAnswersOfQuestion,
      correctAnswer: correctAnswer,
      createdBy: req.userId
    });

    const questionRes = await question.save();
    
    const historyItem = new ActionLog({
      courseId: questionRes._id,
      type: enumData.ActionLogEnType.Create.code,
      createdBy: new mongoose.Types.ObjectId((req as any).userId) as any,
      functionType: "QUESTION",
      description: ` User [${(req as any).username}] has [${enumData.ActionLogEnType.Create.name}] Question`
    })

    await historyItem.save({
      session: session
    })

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "Create Question successfully!",
      question: response,
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to post question!", 422);
      return next(customError);
    }
  }
};

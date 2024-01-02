import { Request, Response, NextFunction } from "express";
import CustomErrorMessage from "../utils/errorMessage";
// const User = require("../models/User");
import User from "../models/User";
interface CustomRequest extends Request {
  userId: string; // Define the userId property
  courseId?: string; // Define the courseId property as optional
  decodedToken?: string; // Define the decodedToken property
  token?: string;
}
module.exports = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    //   retrieve userid from db
    const user = await User.findById(req.userId);
    const isAdmin = user.role === "ADMIN";

    if (!isAdmin) {
      const error = new Error("This user is not admin role!");
      throw error;
    }

    console.log("This user is admin role!");

    next();
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to authorize user with admin role!", 422);
      return error;
    }
    next(error);
  }
};

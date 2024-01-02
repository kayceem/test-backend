const jwt = require("jsonwebtoken");
// const RevokedToken = require("../models/RevokedToken");
import RevokedToken from "../models/RevokedToken";
import { Request, Response, NextFunction } from "express";
import CustomErrorMessage from "../utils/errorMessage";
interface CustomRequest extends Request {
  userId: string; // Define the userId property
  courseId?: string; // Define the courseId property as optional
  decodedToken?: string; // Define the decodedToken property
  token?: string;
}

//Some patterns
const isUserAuth = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    const error = new CustomErrorMessage("Not authenticated.", 422);
    if (!error) {
      const error = new CustomErrorMessage("Failed to authenticate user!", 422);
      return error;
    }
    return next(error);
  }

  const token = req.get("Authorization").split(" ")[1];

  let decodedToken;

  try {
    const isTokenRevoked = await RevokedToken.exists({ token });
    if (isTokenRevoked) {
      return res.status(401).json({ message: "Token revoked" });
    }

    decodedToken = jwt.verify(token, "somesupersecret");
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to authenticate user!", 500);
      return error;
    }
    return next(error);
  }

  if (!decodedToken) {
    const error = new CustomErrorMessage("Not authenticated.", 401);

    if (!error) {
      const error = new CustomErrorMessage("Failed to authenticate user!", 422);
      return error;
    }
    return next(error);
  }

  req.userId = decodedToken.userId;
  if (req.query.courseId) {
    req.courseId = req.query.courseId as string; // Authorize for author (who added the course for theirself)
  }
  req.decodedToken = decodedToken;

  req.token = token;
  next();
};

export default isUserAuth;


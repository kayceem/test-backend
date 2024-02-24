import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import CustomError from "../utils/error";
import CustomErrorMessage from "../utils/errorMessage";
import RevokedToken from "../models/RevokedToken";

interface DecodedToken extends JwtPayload {
  userId: string;
}

export interface AuthorAuthRequest extends Request {
  userId?: string;
  username?: string;
  courseId?: string;
  decodedToken?: string | JwtPayload;
  token?: string;
}

export default async (req: AuthorAuthRequest, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization;
  const authorAuthReq = req as AuthorAuthRequest;

  if (!authorizationHeader) {
    const error = new CustomError("Unauthorized", "Authorization header is missing", 401);
    return next(error);
  }

  const tokenArray = authorizationHeader.split(" ");

  if (tokenArray.length !== 2 || tokenArray[0] !== "Bearer") {
    const error = new CustomError(
      "Unauthorized",
      "Invalid authorization header format. Expected 'Bearer [token]'",
      401
    );
    return next(error);
  }

  const token = tokenArray[1];

  let decodedToken: DecodedToken;

  try {
    const isTokenRevoked = await RevokedToken.exists({ token });

    if (isTokenRevoked) {
      return res.status(401).json({ message: "Token revoked" });
    }

    decodedToken = jwt.verify(token, "somesupersecret") as DecodedToken;
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to authenticate user!", 500);
      return next(customError);
    }
  }

  if (!decodedToken) {
    const error = new CustomError("Unauthorized", "Not authenticated.", 401);

    return next(error);
  }

  authorAuthReq.userId = decodedToken.userId;
  authorAuthReq.username = 'ADMIN'; // TODO LATER

  if (req.query.courseId) {
    authorAuthReq.courseId = req.query.courseId as string;
  }

  authorAuthReq.decodedToken = decodedToken;
  authorAuthReq.token = token;

  next();
};

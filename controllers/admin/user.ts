import { Request, Response, NextFunction } from "express";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import { getCoursesOrderByUserId } from "../../utils/helper";
import CustomError from "../../utils/error";
import CustomErrorMessage from "../../utils/errorMessage";
import { AuthorAuthRequest } from "../../middleware/is-auth";
import { enumData } from "../../config/enumData";
import {
  CREATE_SUCCESS,
  ERROR_CREATE_DATA,
  ERROR_GET_DATA,
  ERROR_GET_DATA_DETAIL,
  ERROR_GET_DATA_HISTORIES,
  ERROR_NOT_FOUND_DATA,
  ERROR_UPDATE_ACTIVE_DATA,
  ERROR_UPDATE_DATA,
  GET_DETAIL_SUCCESS,
  GET_HISOTIES_SUCCESS,
  GET_SUCCESS,
  UPDATE_ACTIVE_SUCCESS,
  UPDATE_SUCCESS,
} from "../../config/constant";
import mongoose, { ClientSession } from "mongoose";
import { coreHelper } from "../../utils/coreHelper";
import ActionLog from "../../models/ActionLog";
import sendmail from "../../utils/sendmail";
import { template } from "../../config/template";

interface getUsersQuery {
  $text?: {
    $search: string;
  };
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { _q } = req.query;

  try {
    const query: getUsersQuery = {};

    if (_q && typeof _q === "string") {
      query.$text = { $search: _q };
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    const result = users.map(async (user) => {
      const courses = await getCoursesOrderByUserId(user._id);
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        phone: user.phone,
        address: user.address,
        payment: user.payment,
        courses,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: user.lastLogin,
        isDeleted: user.isDeleted,
        statusName: enumData.UserStatus[user.status]?.name,
        statusColor: enumData.UserStatus[user.status]?.color,
        status: user.status,
      };
    });

    res.status(200).json({
      message: "Fetch users sucessfully!",
      users: await Promise.all(result),
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch users!", 422);
      return next(customError);
    }
  }
};

export const getUsersSelectBox = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({}).select("_id name");

    const result = users.map((user) => {
      return {
        value: user._id,
        label: user.name,
      };
    });

    res.status(200).json({
      message: "Fetch users sucessfully!",
      users: result,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch users!", 422);
      return next(customError);
    }
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    res.status(200).json({
      message: "fetch single user successfully!",
      user,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch user!", 422);
      return next(customError);
    }
  }
};

export const postUser = async (req: AuthorAuthRequest, res: Response, next: NextFunction) => {
  const { name, email, phone, address, password, role, avatar } = req.body;

  let avatarUrl;

  if (!avatar) {
    avatarUrl =
      "https://lwfiles.mycourse.app/64b5524f42f5698b2785b91e-public/avatars/thumbs/64c077e0557e37da3707bb92.jpg";
  } else {
    avatarUrl = avatar;
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new CustomError("Email", "Email is already registered", 422);
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      name,
      phone,
      avatar: avatarUrl,
      role,
      password: hashedPassword,
      createdBy: req.userId,
    });

    const result = await newUser.save();

    res.status(201).json({
      message: "User created successfully!",
      userId: result._id,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to created user!", 422);
      return next(customError);
    }
  }
};

/** Approve and send email (with username and password for new author) */
export const approveUser = async (req: AuthorAuthRequest, res: Response, next: NextFunction) => {
  const { userId } = req.body;
  let session: ClientSession | null = null;
  session = await mongoose.startSession();
  session.startTransaction();

  try {
    const foundUser = await User.findOne({ _id: userId });

    if (!foundUser) {
        throw new Error(`User ${userId} not found`);
    }
    foundUser.status = enumData.UserStatus.ACTIVE.code;

    const result = await foundUser.save();
    const createdBy = new mongoose.Types.ObjectId(req.userId) as any
    const historyDesc = `User [${(req as any).username}] has [APPROVED] User`
    const functionType = "USER"
    const historyItem = new ActionLog({
      questionId: result._id,
      type: functionType,
      createdBy,
      functionType,
      description: historyDesc
    })

    await ActionLog.collection.insertOne(historyItem.toObject(), { 
      session: session 
  });

  const bodyHtml = template.EmailTemplate.SendUserNameAndPasswordForAuthor.default
  .replace('{0}', foundUser.name) // Replace {0} with the user's name
  .replace('{1}', foundUser.username) // Replace {1} with the user's username
  .replace('{2}', '123456'); // Replace {2} with the generated or default password

    await session.commitTransaction();
    session.endSession();

    await sendmail({
      from: template.EmailTemplate.SendUserNameAndPasswordForAuthor.from,
      to: foundUser.email,
      subject: template.EmailTemplate.SendUserNameAndPasswordForAuthor.name,
      html: bodyHtml,
    });

    res.status(201).json({
      message: "User created successfully!",
      userId: result._id,
    });
  } catch (error) {

    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

      if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to created user!", 422);
      return next(customError);
    }
  }
};

export const updateUser = async (req: AuthorAuthRequest, res: Response, next: NextFunction) => {
  const { name, email, phone, role, avatar } = req.body;
  const { userId } = req.params;

  let avatarUrl;

  if (!avatar) {
    avatarUrl =
      "https://lwfiles.mycourse.app/64b5524f42f5698b2785b91e-public/avatars/thumbs/64c077e0557e37da3707bb92.jpg";
  } else {
    avatarUrl = avatar;
  }

  try {
    const updatedUser = await User.findById(userId);
    updatedUser.name = name;
    updatedUser.email = email;
    updatedUser.phone = phone;
    updatedUser.role = role;
    updatedUser.avatar = avatar;

    updatedUser.updatedAt = new Date();
    updatedUser.updatedBy = new mongoose.Types.ObjectId(req.userId) as any;

    const response = await updatedUser.save();

    res.status(200).json({
      message: "Update user succesfully!",
      user: response,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to update user!", 422);
      return next(customError);
    }
  }
};

export const updateActiveStatusUser = async (
  req: AuthorAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body;

  let session: ClientSession | null = null;
  session = await mongoose.startSession();
  session.startTransaction();

  try {
    const foundUser = await User.findById(userId);

    if (!foundUser) {
      const error = new CustomError("User", ERROR_NOT_FOUND_DATA, 404);
      throw error;
    }

    foundUser.isDeleted = !foundUser.isDeleted;
    foundUser.updatedAt = new Date();
    foundUser.updatedBy = new mongoose.Types.ObjectId(req.userId) as any;

    await foundUser.save();

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: UPDATE_ACTIVE_SUCCESS,
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage(ERROR_UPDATE_ACTIVE_DATA, 422);
      return next(customError);
    }
  }
};

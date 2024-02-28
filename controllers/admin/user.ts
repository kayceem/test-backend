import { Request, Response, NextFunction } from "express";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import { getCoursesOrderByUserId } from "../../utils/helper";
import CustomError from "../../utils/error";
import CustomErrorMessage from "../../utils/errorMessage";
import { AuthorAuthRequest } from "../../middleware/is-auth";
import mongoose from "mongoose";

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

    const users = await User.find(query);

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

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const response = await User.deleteOne({
      _id: userId,
    });
    res.status(200).json({
      message: "user deleted successfully!",
      userId: userId,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to deleted user!", 422);
      return next(customError);
    }
  }
};

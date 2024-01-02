const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const User = require("../models/User");
import User from "../models/User";
const crypto = require("crypto");
const sendmail = require("../utils/sendmail");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const mongoose = require("mongoose");
// const customError = require("../utils/error");
import CustomError from "../utils/error";
const { google } = require("googleapis");

var admin = require("firebase-admin");

var serviceAccount = require("../firebase/serviceAccountKey.json");
// const { BACKEND_URL } = require("../../frontend/src/constant/backend-domain");

const { BACKEND_URL } = require("../config/backend-domain");
const RevokedToken = require("../models/RevokedToken");

import CustomErrorMessage from "../utils/errorMessage";
import { Request, Response, NextFunction } from "express";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

interface CustomRequest extends Request {
  userId: string; // Define the userId property
  courseId?: string; // Define the courseId property as optional
  decodedToken?: string; // Define the decodedToken property
  token?: string;
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { email, name, password, role, avatar, providerId, fbUserId } = req.body;

  //   No validate yet!
  try {
    const user = await User.findOne({ email, providerId });

    if (user) {
      const error = new CustomError("email", "Email already existed at website!", 422);
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userData: any = {
      email,
      name,
      password: hashedPassword,
      role,
      avatar,
      providerId: providerId || "local",
    };

    if (fbUserId) {
      userData.fbUserId = fbUserId;
    }

    const newUser = new User(userData);

    const result = await newUser.save();

    res.status(201).json({
      message: "User created successfully!",
      userId: result._id,
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const userInfoResponse = await oauth2.userinfo.get();
    const email = userInfoResponse.data.email;

    const userDoc = await User.findOne({ email, providerId: "google.com" });

    if (!userDoc) {
      return res.status(401).json({ message: "User not registered!" });
    }

    const jwtToken = jwt.sign(
      { email: userDoc.email, userId: userDoc._id.toString() },
      "somesupersecret",
      { expiresIn: "1h" }
    );

    userDoc.loginToken = jwtToken;
    userDoc.loginTokenExpiration = Date.now() + 60 * 60 * 1000;
    await userDoc.save();
    res.status(200).json({
      message: "Login successful!",
      token: jwtToken,
      userId: userDoc._id.toString(),
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

export const facebookLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { name, id } = req.body;

  try {
    const userDoc = await User.findOne({ socialUserId: id, providerId: "facebook" });

    if (!userDoc) {
      return res.status(401).json({ message: "User not registered!" });
    }

    // Generate a JWT token for the user
    const jwtToken = jwt.sign({ userId: userDoc._id.toString() }, "somesupersecret", {
      expiresIn: "1h",
    });

    // Save login Token to database

    userDoc.loginToken = jwtToken;
    userDoc.loginTokenExpiration = Date.now() + 60 * 60 * 1000;
    await userDoc.save();
    res.status(200).json({
      message: "Login successful!",
      token: jwtToken,
      userId: userDoc._id.toString(),
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({ email, providerId: "local" });

    if (!userDoc) {
      const error = new CustomError("email", "Could not find user by email!", 401);
      error.statusCode = 401;
      throw error;
    }

    const isMatched = await bcrypt.compare(password, userDoc.password);
    if (!isMatched) {
      throw new CustomError("password", "Password wrong!", 401);
    }

    // Create json webtoken here!!!
    const token = jwt.sign(
      { email: userDoc.email, userId: userDoc._id.toString() },
      "somesupersecret",
      { expiresIn: "1h" }
    );

    // Save token to database
    userDoc.loginToken = token;
    userDoc.loginTokenExpiration = Date.now() + 60 * 60 * 1000;
    await userDoc.save();

    res.status(200).json({
      message: "Login successfuly!",
      token: token,
      userId: userDoc._id.toString(),
    });
  } catch (error: any) {
    if (!error.statusCode) {
    }
    next(error);
  }
};

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({ email, providerId: "local" });
    if (!userDoc) {
      const error = new CustomErrorMessage("Could not find user by this email", 401);
      throw error;
    }

    const { role } = userDoc;

    // Authorization
    if (role !== "ADMIN" && role !== "INSTRUCTOR" && role !== "TEACHER") {
      const error = new CustomErrorMessage("Could not authenticate because this account not admin role!", 422);
      throw error;
    }

    const isMatched = await bcrypt.compare(password, userDoc.password);
    if (!isMatched) {
      throw new Error("Password wrong!!!");
    }

    // Create json webtoken here!!!
    const token = jwt.sign(
      { email: userDoc.email, userId: userDoc._id.toString(), adminRole: userDoc.role },
      "somesupersecret",
      { expiresIn: "1h" }
    );

    userDoc.loginToken = token;
    userDoc.loginTokenExpiration = Date.now() + 60 * 60 * 1000;
    await userDoc.save();

    res.status(200).json({
      message: "Login administrator successfuly!",
      token: token,
      userId: userDoc._id.toString(),
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Trường hợp logout này là chưa chính xác lắm!!!. Khi logout làm sao để clear token (revoke thu hồi quyền truy cập access -> sử dụng thêm database redis, hay tạo thêm một database revoke nữa!!!);
export const logout = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const tokenToRevoke = req.token; // Assuming you have a middleware that extracts the token

  try {
    // Add the token to the revoked tokens collection
    const revokedToken = new RevokedToken({ token: tokenToRevoke });
    await revokedToken.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

export const adminLogout = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const tokenToRevoke = req.token; // Assuming you have a middleware that extracts the token

  try {
    // Add the token to the revoked tokens collection
    const revokedToken = new RevokedToken({ token: tokenToRevoke });
    await revokedToken.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

export const checkExistingEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email, providerId } = req.body;

  try {
    const user = await User.findOne({ email, providerId });

    if (!user) {
      res.status(200).json({
        message: `${email} with ${providerId} hasn't register yet`,
        result: "not found",
      });
      return;
    }

    res.status(200).json({
      message: "Email already registered",
      result: "found",
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

export const checkExistingFacebook = async (req: Request, res: Response, next: NextFunction) => {
  const { name, fbUserId } = req.body;

  try {
    const userDoc = await User.findOne({ providerId: "facebook", fbUserId: fbUserId });

    if (!userDoc) {
      res.status(200).json({
        result: "not found",
        message: "No facebook account at website",
      });
    } else {
      res.status(200).json({
        result: "found",
        message: "Facebook account has already existed at website",
      });
    }
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// exports.getReset = async (req, res, next) => {};

export const postReset = async (req: Request, res: Response, next: NextFunction) => {
  const { email, resetPassUrl } = req.body;

  crypto.randomBytes(32, (err: any, buffer: any) => {
    if (err) {
      console.log(err);
    }

    const token = buffer.toString("hex");

    User.findOne({ email: email })
      .then((user: any) => {
        if (!user) {
          const error = new CustomErrorMessage("No Email founded at this website!", 422);
          res.status(402).json({
            message: error,
          });
          throw error;
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result: any) => {
        const { email, _id } = result;
        res.status(202).json({
          message: "Check your email, we aldready send token to your account!",
          user: { email, _id },
        });

        const hrefLink = resetPassUrl
          ? `${resetPassUrl}?token=${token}`
          : `${BACKEND_URL}/site/reset-password.html?token=${token}`;

        sendmail({
          from: "nhatsang0101@gmail.com",
          email: email,
          subject: "Password reset",
          html: `
            <p>You requested a password reset!</p>
            <p>Click this  <a href=${hrefLink}">Link Here</a>  to set a new password.</p>
          `,
        });
      })
      .catch((err: any) => console.log(err));
  });
};

export const getNewPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;
  User.findOne({});
};

export const postNewPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password, userId, passwordToken } = req.body;

  bcrypt.hash(password, 12).then((hashedPassword: any) => {
    User.findOneAndUpdate(
      {
        _id: userId,
        resetToken: passwordToken,
        resetTokenExpiration: {
          $gt: Date.now(),
        },
      },
      {
        $set: {
          password: hashedPassword,
          resetToken: undefined,
          resetTokenExpiration: undefined,
        },
      }
    )
      .then((user: any) => {

        res.status(200).json({
          message: "Update password successfully!",
          user,
        });
      })
      .catch((err: any) => {
        console.log(err);
      });
  });
};

// exports.getUserStatus = async (req, res, next) => {};

// exports.postResetPassword = async (req, res, next) => {};

export const updateLastLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { lastLogin } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { lastLogin });

    res.status(200).json({
      message: "Successfully to update last login for user",
      updatedUser: {
        _id: updatedUser._id,
        lastLogin: updatedUser.lastLogin,
      },
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to update last login for user", 422);
      return error;
    }
    next(error);
  }
};

import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import RevokedToken, { IRevokedToken } from "../models/RevokedToken";
import { UserAuthRequest } from "../middleware/is-user-auth";
import { AuthorAuthRequest } from "../middleware/is-auth";
import crypto from "crypto";
import sendmail from "../utils/sendmail";
import CustomError from "../utils/error";
import CustomErrorMessage from "../utils/errorMessage";
import { google } from "googleapis";
import admin from "firebase-admin";
import serviceAccount from "../firebase/serviceAccountKey.json";
import { BACKEND_URL } from "../config/backend-domain";

const serviceAccountConfig = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientCertUrl: serviceAccount.client_x509_cert_url,
  universeDomain: serviceAccount.universe_domain,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountConfig),
});

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { email, name, password, role, avatar } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const error = new CustomError("Email", "Email already existed at website!", 422);
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userData: Partial<IUser> = {
      email,
      name,
      password: hashedPassword,
      role,
      avatar,
      providerId: "local",
    };

    const newUser = new User(userData);

    const result = await newUser.save();

    res.status(201).json({
      message: "User created successfully!",
      userId: result._id,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Internal Server Error", 500);
      return next(customError);
    }
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
      const error = new CustomError("Email", "Could not find user by email!", 401);
      throw error;
    }

    const jwtToken = jwt.sign(
      { email: userDoc.email, userId: userDoc._id.toString() },
      "somesupersecret",
      { expiresIn: "1h" }
    );

    userDoc.loginToken = jwtToken;
    userDoc.loginTokenExpiration = new Date(Date.now() + 60 * 60 * 1000);
    await userDoc.save();
    res.status(200).json({
      message: "Login successful!",
      token: jwtToken,
      userId: userDoc._id.toString(),
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Internal Server Error", 500);
      return next(customError);
    }
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const userDoc: IUser | null = await User.findOne({ email, providerId: "local" });

    if (!userDoc) {
      const error = new CustomError("Email", "Could not find user by email!", 401);
      throw error;
    }

    const isMatched: boolean = await bcrypt.compare(password, userDoc.password);

    if (!isMatched) {
      const error = new CustomError("Password", "Password wrong!", 401);
      throw error;
    }

    const token = jwt.sign(
      { email: userDoc.email, userId: userDoc._id.toString() },
      "somesupersecret",
      { expiresIn: "1h" }
    );

    userDoc.loginToken = token;
    userDoc.loginTokenExpiration = new Date(Date.now() + 60 * 60 * 1000);
    await userDoc.save();

    res.status(200).json({
      message: "Login successfuly!",
      token: token,
      userId: userDoc._id.toString(),
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Internal Server Error", 500);
      return next(customError);
    }
  }
};

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const userDoc: IUser | null = await User.findOne({ email, providerId: "local" });

    if (!userDoc) {
      const error = new CustomError("Email", "Could not find user by email!", 401);
      throw error;
    }

    const { role } = userDoc;

    if (role !== "ADMIN" && role !== "INSTRUCTOR" && role !== "TEACHER") {
      const error = new CustomErrorMessage(
        "Could not authenticate because this account not admin role!",
        422
      );
      throw error;
    }

    const isMatched: boolean = await bcrypt.compare(password, userDoc.password);

    if (!isMatched) {
      throw new CustomError("Password", "Password wrong!", 401);
    }

    const token = jwt.sign(
      { email: userDoc.email, userId: userDoc._id.toString(), adminRole: userDoc.role },
      "somesupersecret",
      { expiresIn: "1h" }
    );

    userDoc.loginToken = token;
    userDoc.loginTokenExpiration = new Date(Date.now() + 60 * 60 * 1000);
    await userDoc.save();

    res.status(200).json({
      message: "Login administrator successfuly!",
      token: token,
      userId: userDoc._id.toString(),
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Internal Server Error", 500);
      return next(customError);
    }
  }
};

export const logout = async (req: UserAuthRequest, res: Response, next: NextFunction) => {
  try {
    const tokenToRevoke = req.token;

    const revokedTokenData: Partial<IRevokedToken> = { token: tokenToRevoke };
    const revokedToken = new RevokedToken(revokedTokenData);
    await revokedToken.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Internal Server Error", 500);
      return next(customError);
    }
  }
};

export const adminLogout = async (req: AuthorAuthRequest, res: Response, next: NextFunction) => {
  try {
    const tokenToRevoke = req.token;

    const revokedTokenData: Partial<IRevokedToken> = { token: tokenToRevoke };
    const revokedToken = new RevokedToken(revokedTokenData);
    await revokedToken.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Internal Server Error", 500);
      return next(customError);
    }
  }
};

export const postReset = async (req: Request, res: Response, next: NextFunction) => {
  const { email, resetPassUrl }: { email: string; resetPassUrl?: string } = req.body;

  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      const error = new CustomErrorMessage("Error generating password reset", 503);
      return next(error);
    }

    const token = buffer.toString("hex");

    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        const error = new CustomError("Email", "No Email founded at this website!", 422);
        res.status(402).json({ message: error });
        throw error;
      }

      user.resetToken = token;
      user.resetTokenExpiration = new Date(Date.now() + 3600000);
      await user.save();

      res.status(202).json({
        message: "Check your email, we already sent token to your account!",
        user: { email, _id: user._id },
      });

      const hrefLink = resetPassUrl
        ? `${resetPassUrl}?token=${token}`
        : `${BACKEND_URL}/site/reset-password.html?token=${token}`;

      await sendmail({
        from: "nhatsang0101@gmail.com",
        to: email,
        subject: "Password reset",
        html: `<p>You requested a password reset!</p>
               <p>Click this <a href="${hrefLink}">Link Here</a> to set a new password.</p>`,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return next(error);
      } else {
        const customError = new CustomErrorMessage("Internal Server Error", 500);
        return next(customError);
      }
    }
  });
};

export const postNewPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password, userId, passwordToken } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
      },
      {
        $set: {
          password: hashedPassword,
          resetToken: undefined,
          resetTokenExpiration: undefined,
        },
      }
    );

    if (!updatedUser) {
      res.status(404).json({ message: "User not found or token expired." });
      const error = new CustomError("User", "User not found or token expired.", 404);
      throw error;
    }

    res.status(200).json({
      message: "Update password successfully!",
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Internal Server Error", 500);
      return next(customError);
    }
  }
};

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
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to update last login for user", 422);
      return next(customError);
    }
  }
};

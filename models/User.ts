import { Schema, model } from "mongoose";
import baseSchema, { IBaseSchema } from "./BaseSchema";
export interface IUser extends IBaseSchema {
  providerId: string;
  name: string;
  avatar: string;
  email?: string;
  phone?: string;
  address?: string;
  password?: string;
  role?: string;
  payment: string;
  lastLogin?: Date;
  headline?: string;
  biography?: string;
  website?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  language: string;
  showProfile: boolean;
  showCourses: boolean;
  resetToken?: string;
  resetTokenExpiration?: Date;
  loginToken?: string;
  loginTokenExpiration?: Date;
}

const userSchema = new Schema<IUser>(
  {
    providerId: {
      type: "string",
      default: "local",
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://lwfiles.mycourse.app/64b5524f42f5698b2785b91e-public/avatars/thumbs/64c077e0557e37da3707bb92.jpg",
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
    },
    payment: {
      type: String,
      default: "COD",
    },
    lastLogin: {
      type: Date,
    },
    headline: {
      type: String,
    },
    biography: {
      type: String,
    },
    website: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    youtube: {
      type: String,
    },
    language: {
      type: String,
      default: "en",
    },
    showProfile: {
      type: Boolean,
      default: true,
    },
    showCourses: {
      type: Boolean,
      default: true,
    },
    resetToken: String,
    resetTokenExpiration: Date,
    loginToken: String,
    loginTokenExpiration: Date,
  },
  { timestamps: true }
);

userSchema.add(baseSchema);

userSchema.index({ name: "text", email: "text" });

const User = model<IUser>("User", userSchema);

export default User;

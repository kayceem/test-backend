import { IBaseSchema } from "./base.type";

export interface IUser extends IBaseSchema {
  providerId: string;
  name: string;
  avatar: string;
  username?: string
  email?: string;
  phone?: string;
  address?: string;
  password?: string;
  role?: string;
  payment: string;
  headline?: string;
  biography?: string;
  website?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  language: string;
  resetToken?: string;
  loginToken?: string;
  showProfile: boolean;
  showCourses: boolean;
  lastLogin?: Date;
  resetTokenExpiration?: Date;
  loginTokenExpiration?: Date;
}

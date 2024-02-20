import { IBaseSchema } from "./base.type";

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

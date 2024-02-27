import { ObjectId } from "mongoose";
import { IBaseSchema } from "./base.type";

export interface ICategoryBlog extends IBaseSchema {
  _id: ObjectId;
  name: string;
  description: string;
  cateImage: string;
  blogs: ObjectId[]; 
}

import { IBaseSchema } from "./base.type";

export interface IFeedback extends IBaseSchema {
  name: string;
  email: string;
  message: string;
}

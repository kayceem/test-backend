import { Schema, Document } from "mongoose";

export interface IBaseSchema extends Document {
  createdAt: Date;
  createdBy?: Schema.Types.ObjectId;
  updatedAt: Date;
  updatedBy?: Schema.Types.ObjectId;
  isDeleted: boolean;
}

const baseSchema: Schema<IBaseSchema> = new Schema<IBaseSchema>(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedAt: {
      type: Date,
      // default: Date.now,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { discriminatorKey: "kind" }
);

export default baseSchema;

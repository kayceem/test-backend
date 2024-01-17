import { Schema, model } from "mongoose";
import baseSchema, { IBaseSchema } from "./BaseSchema";
export interface IRevokedToken extends IBaseSchema {
  token: string;
}

const revokedTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 7,
  },
});

revokedTokenSchema.add(baseSchema);

const RevokedToken = model<IRevokedToken>("RevokedToken", revokedTokenSchema);

export default RevokedToken;

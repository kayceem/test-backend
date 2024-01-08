import { Schema, model, Document } from "mongoose";
export interface IUser extends Document {
  providerId?: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  role: string;
  payment: string;
  lastLogin?: Date;
  headline: string;
  biography: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  language?: string;
  showProfile?: boolean;
  showCourses?: boolean;
  courses?: string;
  certificates?: string;
  createdAt?: Date;
  updatedAt?: Date;
  resetToken?: string;
  resetTokenExpiration?: Date;
  loginToken: string;
  loginTokenExpiration: Date;
}

// Declare the Schema of the Mongo model
const userSchema = new Schema<any>(
  {
    providerId: {
      type: "string",
      default: "local",
    },
    name: {
      type: String,
      required: true,
      // index: true,
    },
    avatar: {
      type: String,
      default:
        "https://lwfiles.mycourse.app/64b5524f42f5698b2785b91e-public/avatars/thumbs/64c077e0557e37da3707bb92.jpg",
    },
    email: {
      type: String,
      // required: true,
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
    // fbUserId: {
    //   type: String,
    //   default: "",
    // },
  },
  { timestamps: true }
);

userSchema.index({ name: "text", email: "text" });

//Export the model
// module.exports = mongoose.model("User", userSchema);
export default model<any & Document>("User", userSchema);

import { Schema, model, Document } from "mongoose";
import { ObjectId } from "mongodb";

interface ILesson extends Document {
  sectionId: ObjectId;
  name: string;
  icon: string;
  description: string;
  content: string;
  videoLength: number;
  access: string;
  type: string;
  password: string;
  oldPrice: number;
  discount: number;
  images: string;
  thumbnail: string;
  shortDesc: string;
  fullDesc: string;
  stockQty: number;
  categoryId: string;
}

// Declare the Schema of the Mongo model
const lessonSchema = new Schema<ILesson>(
  {
    sectionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Section",
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    icon: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String, // Link youtube
      required: true,
    },
    videoLength: {
      type: Number,
    },
    access: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

//Export the model
// module.exports = mongoose.model("Lesson", lessonSchema);
const Lesson = model<ILesson>("Lesson", lessonSchema);

export default Lesson;

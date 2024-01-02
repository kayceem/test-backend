import { Schema, model, Document } from 'mongoose';

// Declare the Schema of the Mongo model
const isLessonDoneSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    lessonId: {
      type: String,
      required: true,
      ref: "Lesson",
    },
    isDone: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

//Export the model
// module.exports = mongoose.model("IsLessonDone", isLessonDoneSchema);
export default model<Document>('IsLessonDone', isLessonDoneSchema);

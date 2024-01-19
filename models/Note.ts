// Xây dựng model note api theo số phút
import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  videoMinute: {
    type: Number,
    required: true,
  },
});

const Note = mongoose.model("Note", NoteSchema);

export default Note;

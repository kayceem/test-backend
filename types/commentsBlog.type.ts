import { Document, Schema } from "mongoose";

export interface IBlogComment extends Document {
  content: string;
  userId: Schema.Types.ObjectId;
  blogId: Schema.Types.ObjectId;
  parentCommentId?: Schema.Types.ObjectId;
  isDeleted: boolean;
  likes: Schema.Types.ObjectId[]; // Thêm dòng này
  replies: Schema.Types.ObjectId[]; // Thêm dòng này
}

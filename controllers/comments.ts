import Comment from '../models/Comment';
import { Request, Response } from 'express';

export const createComment = async (req: Request, res: Response) => {
  try {
    const { content, userId, postId, parentCommentId } = req.body;
    const newComment = new Comment({
      content,
      userId,
      postId,
      parentCommentId: parentCommentId || null
    }); 

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId: postId }).populate('userId');
    res.json(comments);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};


export const updateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    );

    if (!updatedComment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    res.json(updatedComment);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const likeComment = async (req: Request, res: Response) => {
  try {
    const { commentId, userId } = req.body;
    console.log(commentId, userId);
    

    const comment = await Comment.findById(commentId);
 
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    const index = comment.likes.indexOf(userId);
    if (index === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(index, 1); // Remove user from likes if already liked
    }

    await comment.save();
    res.json(comment);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};


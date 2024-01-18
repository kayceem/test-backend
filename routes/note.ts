import express from "express";
import {
  getAllNote,
  createNote,
  updateNote,
  deleteNote,
  getNoteByUserId,
} from "../controllers/note";

const router = express.Router();

// Get all notes
router.get("/", getAllNote);

router.get("/:id", getNoteByUserId);

// Create a new note
router.post("/", createNote);

// Update a note
router.put("/:id", updateNote);

// Delete a note
router.delete("/:id", deleteNote);

export default router;

import express from "express";
import {
  getAllNote,
  createNote,
  updateNote,
  deleteNote,
  getNoteByUserId,
  getNoteById,
} from "../../controllers/admin/noteCourse";

const router = express.Router();

// Get all notes
router.get("/", getAllNote);

router.get("/:id", getNoteByUserId);

router.get("/noteId/:noteId", getNoteById);

// Create a new note
router.post("/createNote", createNote);

// Update a note
router.put("/update/:id", updateNote);

// Delete a note
router.delete("/delete/:id", deleteNote);

export default router;

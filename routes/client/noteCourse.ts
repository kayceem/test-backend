import express from "express";
import {
  getAllNote,
  createNote,
  updateNote,
  deleteNote,
  getNoteByUserId,
} from "../../controllers/client/noteCourse";

const router = express.Router();

// Get all notes
router.get("/", getAllNote);

router.get("/:id", getNoteByUserId);

// Create a new note
router.post("/createNote", createNote);

// Update a note
router.put("/update/:id", updateNote);

// Delete a note
router.delete("/delete/:id", deleteNote);

export default router;

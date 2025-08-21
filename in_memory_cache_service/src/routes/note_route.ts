import { Express } from "express";
import {
  ALL_NOTES_ROUTE,
  SPECIFIC_NOTE_ROUTE,
} from "../constants/routes_constants";
import NoteController from "../controllers/note_controller";

function configureNoteRoutes(app: Express): void {
  app.get(ALL_NOTES_ROUTE, NoteController.getAllNotes);
  app.get(SPECIFIC_NOTE_ROUTE, NoteController.getNote);
  app.post(ALL_NOTES_ROUTE, NoteController.createNote);
  app.patch(SPECIFIC_NOTE_ROUTE, NoteController.updateNote);
  app.delete(SPECIFIC_NOTE_ROUTE, NoteController.deleteNote);
}

export default configureNoteRoutes;

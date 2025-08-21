import { Request, Response } from "express";
import NoteRepositoryFactory from "../domains/note/note_repository_factory";
import { StatusCodes } from "http-status-codes";
import NoteEntityFactory from "../domains/note/note_entity_factory";
import VerifyIfUserExistsAdapter from "../infrastructure/concerns/verify_if_user_exists_adapter";

class NoteController {
  public static async getAllNotes(
    request: Request,
    response: Response,
  ): Promise<void> {
    try {
      const userId = Number(request.params.user_id);

      const noteRepository = await NoteRepositoryFactory.getInstance();

      const userNotes = await noteRepository.getNotes(userId);

      response.json(userNotes);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      response.status(StatusCodes.NOT_FOUND).send("");
    }
  }

  public static async getNote(
    request: Request,
    response: Response,
  ): Promise<void> {
    try {
      const noteId = Number(request.params.id);

      const noteRepository = await NoteRepositoryFactory.getInstance();

      const note = await noteRepository.getNote(noteId);

      response.json(note);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      response.status(StatusCodes.NOT_FOUND).send("");
    }
  }

  public static async createNote(
    request: Request,
    response: Response,
  ): Promise<void> {
    try {
      const userId = Number(request.body.userId);

      await VerifyIfUserExistsAdapter.verifyIfUserExists(userId);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      response.status(StatusCodes.NOT_FOUND).send("");

      return;
    }

    try {
      const noteRepository = await NoteRepositoryFactory.getInstance();

      const noteId = Number(request.body.id);
      const noteTitle = request.body.title;
      const noteBody = request.body.body;
      const noteCreatedAt = Number(request.body.createdAt);
      const noteUpdatedAt = Number(request.body.updatedAt);
      const noteUserId = Number(request.body.userId);

      const note = NoteEntityFactory.getInstance(
        noteId,
        noteTitle,
        noteBody,
        noteCreatedAt,
        noteUpdatedAt,
        noteUserId,
      );

      await noteRepository.createNote(note);

      response.status(StatusCodes.CREATED).send("");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      response.status(StatusCodes.CONFLICT).send("");
    }
  }

  public static async updateNote(
    request: Request,
    response: Response,
  ): Promise<void> {
    try {
      const noteRepository = await NoteRepositoryFactory.getInstance();

      const noteId = Number(request.body.id);
      const noteTitle = request.body.title;
      const noteBody = request.body.body;
      const noteCreatedAt = Number(request.body.createdAt);
      const noteUpdatedAt = Number(request.body.updatedAt);
      const noteUserId = Number(request.body.userId);

      const note = NoteEntityFactory.getInstance(
        noteId,
        noteTitle,
        noteBody,
        noteCreatedAt,
        noteUpdatedAt,
        noteUserId,
      );

      await noteRepository.updateNote(note);

      response.status(StatusCodes.OK).send("");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      response.status(StatusCodes.NOT_FOUND).send("");
    }
  }

  public static async deleteNote(
    request: Request,
    response: Response,
  ): Promise<void> {
    try {
      const noteId = Number(request.params.id);
      const userId = Number(request.params.user_id);

      const noteRepository = await NoteRepositoryFactory.getInstance();

      await noteRepository.deleteNote(noteId, userId);

      response.json(StatusCodes.NO_CONTENT);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      response.status(StatusCodes.NOT_FOUND).send("");
    }
  }
}

export default NoteController;

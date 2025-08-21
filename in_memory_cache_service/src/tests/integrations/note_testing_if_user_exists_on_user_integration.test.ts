import { describe, beforeAll, test, expect } from "@jest/globals";
import NoteRepository from "../../domains/note/note_repository";
import NoteRepositoryFactory from "../../domains/note/note_repository_factory";
import NoteEntityFactory from "../../domains/note/note_entity_factory";
import {
  NOTE_BODY,
  NOTE_CREATED_AT,
  NOTE_ID,
  NOTE_TITLE,
  NOTE_UPDATED_AT,
} from "../../constants/domains/note_constants";
import {
  NOT_EXISTING_USER_ERROR_MESSAGE,
  NOT_EXISTING_USER_ERROR_NAME,
  USER_ID,
} from "../../constants/domains/user_constants";

describe('Test If Integration Of "Note Testing If User Exists On User" Behavior', () => {
  let noteRepository: NoteRepository;

  beforeAll(async () => {
    noteRepository = await NoteRepositoryFactory.getInstance();
  });

  test("Test If Note Throws Not Existing User Error If User Does Note Exist", async () => {
    try {
      const note = NoteEntityFactory.getInstance(
        NOTE_ID,
        NOTE_TITLE,
        NOTE_BODY,
        NOTE_CREATED_AT,
        NOTE_UPDATED_AT,
        USER_ID,
      );

      await noteRepository.createNote(note);
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_USER_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_USER_ERROR_MESSAGE);
    }
  });
});

import { describe, beforeAll, afterAll, test, expect } from "@jest/globals";
import { USER_ID, USER_USERNAME } from "../../constants/domains/user_constants";
import UserRepositoryFactory from "../../domains/user/user_repository_factory";
import UserRepository from "../../domains/user/user_repository";
import UserEntityFactory from "../../domains/user/user_entity_factory";
import NoteRepositoryFactory from "../../domains/note/note_repository_factory";
import NoteEntityFactory from "../../domains/note/note_entity_factory";
import {
  NOT_EXISTING_NOTE_ERROR_MESSAGE,
  NOT_EXISTING_NOTE_ERROR_NAME,
  NOTE_BODY,
  NOTE_CREATED_AT,
  NOTE_ID,
  NOTE_TITLE,
  NOTE_UPDATED_AT,
} from "../../constants/domains/note_constants";

describe('Test If Integration Of "Note Using In-Memory Database" Behavior', () => {
  let userRepository: UserRepository;

  beforeAll(async () => {
    userRepository = await UserRepositoryFactory.getInstance();

    try {
      const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

      await userRepository.createUser(user);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  afterAll(async () => {
    try {
      await userRepository.deleteUser(USER_ID);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  test("Test If Note Handles Its On Operations On In-Memory Database", async () => {
    const noteRepository = await NoteRepositoryFactory.getInstance();

    const note = NoteEntityFactory.getInstance(
      NOTE_ID,
      "",
      "",
      NOTE_CREATED_AT,
      NOTE_UPDATED_AT,
      USER_ID,
    );

    await noteRepository.createNote(note);

    const initialNote = await noteRepository.getNote(NOTE_ID);

    expect(initialNote.id).toEqual(NOTE_ID);
    expect(initialNote.title).toEqual("");
    expect(initialNote.body).toEqual("");
    expect(initialNote.createdAt).toEqual(NOTE_CREATED_AT);
    expect(initialNote.updatedAt).toEqual(NOTE_UPDATED_AT);
    expect(initialNote.userId).toEqual(USER_ID);

    const updatedNote = NoteEntityFactory.getInstance(
      NOTE_ID,
      NOTE_TITLE,
      NOTE_BODY,
      NOTE_CREATED_AT,
      NOTE_UPDATED_AT,
      USER_ID,
    );

    await noteRepository.updateNote(updatedNote);

    const retrievedNote = (await noteRepository.getNotes(USER_ID))[0];

    expect(retrievedNote.id).toEqual(NOTE_ID);
    expect(retrievedNote.title).toEqual(NOTE_TITLE);
    expect(retrievedNote.body).toEqual(NOTE_BODY);
    expect(retrievedNote.createdAt).toEqual(NOTE_CREATED_AT);
    expect(retrievedNote.updatedAt).toEqual(NOTE_UPDATED_AT);
    expect(retrievedNote.userId).toEqual(USER_ID);

    await noteRepository.deleteNote(NOTE_ID, USER_ID);

    try {
      await noteRepository.getNote(NOTE_ID);
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_NOTE_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_NOTE_ERROR_MESSAGE);
    }
  });
});

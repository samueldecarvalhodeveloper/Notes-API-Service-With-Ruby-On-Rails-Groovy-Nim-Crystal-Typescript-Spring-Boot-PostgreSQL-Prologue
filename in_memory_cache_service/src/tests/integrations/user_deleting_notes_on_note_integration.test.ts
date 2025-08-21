import { describe, beforeAll, test, expect } from "@jest/globals";
import NoteRepository from "../../domains/note/note_repository";
import UserRepository from "../../domains/user/user_repository";
import UserRepositoryFactory from "../../domains/user/user_repository_factory";
import NoteRepositoryFactory from "../../domains/note/note_repository_factory";
import UserEntityFactory from "../../domains/user/user_entity_factory";
import { USER_ID, USER_USERNAME } from "../../constants/domains/user_constants";
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

describe('Test If Integration Of "User Deleting Notes On Note" Behavior', () => {
  let userRepository: UserRepository;
  let noteRepository: NoteRepository;

  beforeAll(async () => {
    userRepository = await UserRepositoryFactory.getInstance();
    noteRepository = await NoteRepositoryFactory.getInstance();

    try {
      const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

      await userRepository.createUser(user);

      const note = NoteEntityFactory.getInstance(
        NOTE_ID,
        NOTE_TITLE,
        NOTE_BODY,
        NOTE_CREATED_AT,
        NOTE_UPDATED_AT,
        USER_ID,
      );

      await noteRepository.createNote(note);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  test("Test If User Deletes All Notes On Note When User Is Deleted", async () => {
    await userRepository.deleteUser(USER_ID);

    try {
      await noteRepository.getNote(NOTE_ID);
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_NOTE_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_NOTE_ERROR_MESSAGE);
    }
  });
});

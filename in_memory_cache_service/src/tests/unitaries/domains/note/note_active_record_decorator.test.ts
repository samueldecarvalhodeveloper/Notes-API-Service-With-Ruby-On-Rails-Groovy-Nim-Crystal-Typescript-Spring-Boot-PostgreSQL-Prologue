import {
  describe,
  beforeAll,
  beforeEach,
  afterAll,
  test,
  expect,
} from "@jest/globals";
import InMemoryDatabase from "../../../../domains/in_memory_database/in_memory_database";
import InMemoryDatabaseFactory from "../../../../domains/in_memory_database/in_memory_database_factory";
import {
  IN_MEMORY_DATABASE_HOST_NAME,
  IN_MEMORY_DATABASE_HOST_PORT,
} from "../../../../constants/application_constants";
import NoteActiveRecord from "../../../../domains/note/note_active_record";
import UserRepository from "../../../../domains/user/user_repository";
import UserRepositoryFactory from "../../../../domains/user/user_repository_factory";
import NoteActiveRecordDecorator from "../../../../domains/note/note_active_record_decorator";
import {
  NOT_EXISTING_USER_ERROR_MESSAGE,
  NOT_EXISTING_USER_ERROR_NAME,
  USER_ID,
  USER_USERNAME,
} from "../../../../constants/domains/user_constants";
import {
  ALREADY_EXISTING_NOTE_ERROR_MESSAGE,
  ALREADY_EXISTING_NOTE_ERROR_NAME,
  NOT_EXISTING_NOTE_ERROR_MESSAGE,
  NOT_EXISTING_NOTE_ERROR_NAME,
  NOTE_BODY,
  NOTE_BODY_IN_MEMORY_DATABASE_KEY,
  NOTE_CREATED_AT,
  NOTE_CREATED_AT_IN_MEMORY_DATABASE_KEY,
  NOTE_HASH_IN_MEMORY_DATABASE_KEY,
  NOTE_ID,
  NOTE_ID_IN_MEMORY_DATABASE_KEY,
  NOTE_IN_MEMORY_DATABASE_KEY,
  NOTE_TITLE,
  NOTE_TITLE_IN_MEMORY_DATABASE_KEY,
  NOTE_UPDATED_AT,
  NOTE_UPDATED_AT_IN_MEMORY_DATABASE_KEY,
  NOTE_USER_ID_IN_MEMORY_DATABASE_KEY,
} from "../../../../constants/domains/note_constants";
import NoteEntityFactory from "../../../../domains/note/note_entity_factory";
import UserEntityFactory from "../../../../domains/user/user_entity_factory";
import HashItemEntityFactory from "../../../../domains/in_memory_database/hash_item_entity_factory";

describe("Test Class NoteActiveRecordDecorator Behavior", () => {
  let inMemoryDatabase: InMemoryDatabase;
  let userRepository: UserRepository;
  let noteActiveRecord: NoteActiveRecord;

  beforeAll(async () => {
    inMemoryDatabase = await InMemoryDatabaseFactory.getInstance(
      IN_MEMORY_DATABASE_HOST_NAME,
      IN_MEMORY_DATABASE_HOST_PORT,
    );

    userRepository = await UserRepositoryFactory.getInstance();

    noteActiveRecord = new NoteActiveRecordDecorator(inMemoryDatabase);
  });

  beforeEach(async () => {
    try {
      await userRepository.deleteUser(USER_ID);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}

    try {
      await inMemoryDatabase.deleteValueFromSet(
        NOTE_IN_MEMORY_DATABASE_KEY(USER_ID),
        NOTE_ID.toString(),
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}

    try {
      await inMemoryDatabase.deleteHash(
        NOTE_HASH_IN_MEMORY_DATABASE_KEY(NOTE_ID),
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  afterAll(async () => {
    try {
      await userRepository.deleteUser(USER_ID);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}

    try {
      await inMemoryDatabase.deleteValueFromSet(
        NOTE_IN_MEMORY_DATABASE_KEY(USER_ID),
        NOTE_ID.toString(),
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}

    try {
      await inMemoryDatabase.deleteHash(
        NOTE_HASH_IN_MEMORY_DATABASE_KEY(NOTE_ID),
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  test('Test If Method "getAllNotesFromInMemoryDatabase" Throws Not Existing User Error If Not User Does Not Exist On In-Memory Database', async () => {
    try {
      await noteActiveRecord.getAllNotesFromInMemoryDatabase(USER_ID);
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_USER_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_USER_ERROR_MESSAGE);
    }
  });

  test('Test If Method "getNoteFromInMemoryDatabase" Throws Not Existing Note Error If Not Does Not Exist On In-Memory Database', async () => {
    try {
      await noteActiveRecord.getNoteFromInMemoryDatabase(NOTE_ID);
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_NOTE_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_NOTE_ERROR_MESSAGE);
    }
  });

  test('Test If Method "createNoteOnInMemoryDatabase" Throws Not Existing User Error If Not User Does Not Exist On In-Memory Database', async () => {
    try {
      const note = NoteEntityFactory.getInstance(
        NOTE_ID,
        NOTE_TITLE,
        NOTE_BODY,
        NOTE_CREATED_AT,
        NOTE_UPDATED_AT,
        USER_ID,
      );

      await noteActiveRecord.createNoteOnInMemoryDatabase(note);
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_USER_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_USER_ERROR_MESSAGE);
    }
  });

  test('Test If Method "createNoteOnInMemoryDatabase" Throws Already Existing Note Error If Note Already Exists On In-Memory Database', async () => {
    const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    await userRepository.createUser(user);

    await inMemoryDatabase.addValueToSet(
      NOTE_IN_MEMORY_DATABASE_KEY(USER_ID),
      NOTE_ID.toString(),
    );

    await inMemoryDatabase.addHash(NOTE_HASH_IN_MEMORY_DATABASE_KEY(NOTE_ID), [
      HashItemEntityFactory.getInstance(
        NOTE_ID_IN_MEMORY_DATABASE_KEY,
        NOTE_ID.toString(),
      ),
      HashItemEntityFactory.getInstance(
        NOTE_TITLE_IN_MEMORY_DATABASE_KEY,
        NOTE_TITLE,
      ),
      HashItemEntityFactory.getInstance(
        NOTE_BODY_IN_MEMORY_DATABASE_KEY,
        NOTE_BODY,
      ),
      HashItemEntityFactory.getInstance(
        NOTE_CREATED_AT_IN_MEMORY_DATABASE_KEY,
        NOTE_CREATED_AT.toString(),
      ),
      HashItemEntityFactory.getInstance(
        NOTE_UPDATED_AT_IN_MEMORY_DATABASE_KEY,
        NOTE_UPDATED_AT.toString(),
      ),
      HashItemEntityFactory.getInstance(
        NOTE_USER_ID_IN_MEMORY_DATABASE_KEY,
        USER_ID.toString(),
      ),
    ]);

    try {
      const note = NoteEntityFactory.getInstance(
        NOTE_ID,
        NOTE_TITLE,
        NOTE_BODY,
        NOTE_CREATED_AT,
        NOTE_UPDATED_AT,
        USER_ID,
      );

      await noteActiveRecord.createNoteOnInMemoryDatabase(note);
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(ALREADY_EXISTING_NOTE_ERROR_NAME);
      expect(castedError.message).toEqual(ALREADY_EXISTING_NOTE_ERROR_MESSAGE);
    }
  });

  test('Test If Method "updateNoteOnInMemoryDatabase" Throws Not Existing User Error If Not User Does Not Exist On In-Memory Database', async () => {
    try {
      const note = NoteEntityFactory.getInstance(
        NOTE_ID,
        NOTE_TITLE,
        NOTE_BODY,
        NOTE_CREATED_AT,
        NOTE_UPDATED_AT,
        USER_ID,
      );

      await noteActiveRecord.updateNoteOnInMemoryDatabase(note);
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_USER_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_USER_ERROR_MESSAGE);
    }
  });

  test('Test If Method "updateNoteOnInMemoryDatabase" Throws Not Existing Note Error If Not Does Not Exist On In-Memory Database', async () => {
    const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    await userRepository.createUser(user);

    try {
      const note = NoteEntityFactory.getInstance(
        NOTE_ID,
        NOTE_TITLE,
        NOTE_BODY,
        NOTE_CREATED_AT,
        NOTE_UPDATED_AT,
        USER_ID,
      );

      await noteActiveRecord.updateNoteOnInMemoryDatabase(note);
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_NOTE_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_NOTE_ERROR_MESSAGE);
    }
  });

  test('Test If Method "deleteNoteOnInMemoryDatabase" Throws Not Existing User Error If Not User Does Not Exist On In-Memory Database', async () => {
    try {
      await noteActiveRecord.deleteNoteOnInMemoryDatabase(NOTE_ID, USER_ID);
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_USER_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_USER_ERROR_MESSAGE);
    }
  });

  test('Test If Method "deleteNoteOnInMemoryDatabase" Throws Not Existing Note Error If Not Does Not Exist On In-Memory Database', async () => {
    const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    await userRepository.createUser(user);

    try {
      await noteActiveRecord.deleteNoteOnInMemoryDatabase(NOTE_ID, USER_ID);
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_NOTE_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_NOTE_ERROR_MESSAGE);
    }
  });
});

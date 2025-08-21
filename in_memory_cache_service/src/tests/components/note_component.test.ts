import {
  describe,
  beforeAll,
  beforeEach,
  afterAll,
  test,
  expect,
} from "@jest/globals";
import InMemoryDatabaseFactory from "../../domains/in_memory_database/in_memory_database_factory";
import {
  IN_MEMORY_DATABASE_HOST_NAME,
  IN_MEMORY_DATABASE_HOST_PORT,
} from "../../constants/application_constants";
import NoteActiveRecord from "../../domains/note/note_active_record";
import UserRepository from "../../domains/user/user_repository";
import UserRepositoryFactory from "../../domains/user/user_repository_factory";
import UserEntityFactory from "../../domains/user/user_entity_factory";
import {
  USER_ID,
  USER_USERNAME,
} from "../../constants/domains/user_constants";
import {
  NOT_EXISTING_NOTE_ERROR_MESSAGE,
  NOT_EXISTING_NOTE_ERROR_NAME,
  NOTE_BODY,
  NOTE_CREATED_AT,
  NOTE_ID,
  NOTE_TITLE,
  NOTE_UPDATED_AT,
} from "../../constants/domains/note_constants";
import NoteEntityFactory from "../../domains/note/note_entity_factory";
import NoteRepository from "../../domains/note/note_repository";
import NoteActiveRecordDecorator from "../../domains/note/note_active_record_decorator";

describe("Test Component Note Behavior", () => {
  let userRepository: UserRepository;
  let noteActiveRecord: NoteActiveRecord;
  let noteRepository: NoteRepository;

  beforeAll(async () => {
    const inMemoryDatabase = await InMemoryDatabaseFactory.getInstance(
      IN_MEMORY_DATABASE_HOST_NAME,
      IN_MEMORY_DATABASE_HOST_PORT,
    );

    userRepository = await UserRepositoryFactory.getInstance();

    noteActiveRecord = new NoteActiveRecordDecorator(inMemoryDatabase);

    noteRepository = new NoteRepository(noteActiveRecord);

    try {
      const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

      await userRepository.createUser(user);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  beforeEach(async () => {
    try {
      await noteActiveRecord.deleteNoteOnInMemoryDatabase(NOTE_ID, USER_ID);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  afterAll(async () => {
    try {
      await userRepository.deleteUser(USER_ID);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  test('Test Fetching All Users\'s Notes', async () => {
    const note = NoteEntityFactory.getInstance(
      NOTE_ID,
      NOTE_TITLE,
      NOTE_BODY,
      NOTE_CREATED_AT,
      NOTE_UPDATED_AT,
      USER_ID,
    );

    await noteActiveRecord.createNoteOnInMemoryDatabase(note);

    const userNotes = await noteRepository.getNotes(USER_ID);

    expect(userNotes[0].id).toEqual(NOTE_ID);
    expect(userNotes[0].title).toEqual(NOTE_TITLE);
    expect(userNotes[0].body).toEqual(NOTE_BODY);
    expect(userNotes[0].createdAt).toEqual(NOTE_CREATED_AT);
    expect(userNotes[0].updatedAt).toEqual(NOTE_UPDATED_AT);
    expect(userNotes[0].userId).toEqual(USER_ID);
  });

  test('Test Fetching Users\'s Note', async () => {
    const note = NoteEntityFactory.getInstance(
      NOTE_ID,
      NOTE_TITLE,
      NOTE_BODY,
      NOTE_CREATED_AT,
      NOTE_UPDATED_AT,
      USER_ID,
    );

    await noteActiveRecord.createNoteOnInMemoryDatabase(note);

    const userNote = await noteRepository.getNote(NOTE_ID);

    expect(userNote.id).toEqual(NOTE_ID);
    expect(userNote.title).toEqual(NOTE_TITLE);
    expect(userNote.body).toEqual(NOTE_BODY);
    expect(userNote.createdAt).toEqual(NOTE_CREATED_AT);
    expect(userNote.updatedAt).toEqual(NOTE_UPDATED_AT);
    expect(userNote.userId).toEqual(USER_ID);
  });

  test('Test Creating Note On Database', async () => {
    const note = NoteEntityFactory.getInstance(
      NOTE_ID,
      NOTE_TITLE,
      NOTE_BODY,
      NOTE_CREATED_AT,
      NOTE_UPDATED_AT,
      USER_ID,
    );

    await noteRepository.createNote(note);

    const userNote =
      await noteActiveRecord.getNoteFromInMemoryDatabase(NOTE_ID);

    expect(userNote.id).toEqual(NOTE_ID);
    expect(userNote.title).toEqual(NOTE_TITLE);
    expect(userNote.body).toEqual(NOTE_BODY);
    expect(userNote.createdAt).toEqual(NOTE_CREATED_AT);
    expect(userNote.updatedAt).toEqual(NOTE_UPDATED_AT);
    expect(userNote.userId).toEqual(USER_ID);
  });

  test('Test Updating Note On Database', async () => {
    const note = NoteEntityFactory.getInstance(
      NOTE_ID,
      "",
      "",
      Math.random(),
      Math.random(),
      USER_ID,
    );

    await noteActiveRecord.createNoteOnInMemoryDatabase(note);

    const noteWithUpdatedData = NoteEntityFactory.getInstance(
      NOTE_ID,
      NOTE_TITLE,
      NOTE_BODY,
      NOTE_CREATED_AT,
      NOTE_UPDATED_AT,
      USER_ID,
    );

    await noteRepository.updateNote(noteWithUpdatedData);

    const updatedNote =
      await noteActiveRecord.getNoteFromInMemoryDatabase(NOTE_ID);

    expect(updatedNote.id).toEqual(NOTE_ID);
    expect(updatedNote.title).toEqual(NOTE_TITLE);
    expect(updatedNote.body).toEqual(NOTE_BODY);
    expect(updatedNote.createdAt).toEqual(NOTE_CREATED_AT);
    expect(updatedNote.updatedAt).toEqual(NOTE_UPDATED_AT);
    expect(updatedNote.userId).toEqual(USER_ID);
  });

  test('Test Deleting Note On Database', async () => {
    const note = NoteEntityFactory.getInstance(
      NOTE_ID,
      NOTE_TITLE,
      NOTE_BODY,
      NOTE_CREATED_AT,
      NOTE_UPDATED_AT,
      USER_ID,
    );

    await noteActiveRecord.createNoteOnInMemoryDatabase(note);

    try {
      await noteRepository.deleteNote(NOTE_ID, USER_ID);
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_NOTE_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_NOTE_ERROR_MESSAGE);
    }
  });
});

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
import UserEntityFactory from "../../../../domains/user/user_entity_factory";
import {
  USER_ID,
  USER_USERNAME,
} from "../../../../constants/domains/user_constants";
import {
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
import HashItemEntityFactory from "../../../../domains/in_memory_database/hash_item_entity_factory";
import NoteEntityFactory from "../../../../domains/note/note_entity_factory";
import {
  NOT_EXISTING_HASH_ERROR_MESSAGE,
  NOT_EXISTING_HASH_ERROR_NAME,
} from "../../../../constants/domains/in_memory_database_constants";

describe("Test Class NoteActiveRecord Behavior", () => {
  let inMemoryDatabase: InMemoryDatabase;
  let userRepository: UserRepository;
  let noteActiveRecord: NoteActiveRecord;

  beforeAll(async () => {
    inMemoryDatabase = await InMemoryDatabaseFactory.getInstance(
      IN_MEMORY_DATABASE_HOST_NAME,
      IN_MEMORY_DATABASE_HOST_PORT,
    );

    userRepository = await UserRepositoryFactory.getInstance();

    noteActiveRecord = new NoteActiveRecord(inMemoryDatabase);

    try {
      const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

      await userRepository.createUser(user);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  beforeEach(async () => {
    try {
      await inMemoryDatabase.deleteValueFromSet(
        NOTE_IN_MEMORY_DATABASE_KEY(USER_ID),
        NOTE_ID.toString(),
      );

      await inMemoryDatabase.deleteHash(
        NOTE_HASH_IN_MEMORY_DATABASE_KEY(NOTE_ID),
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  afterAll(async () => {
    try {
      await userRepository.deleteUser(USER_ID);

      await inMemoryDatabase.deleteValueFromSet(
        NOTE_IN_MEMORY_DATABASE_KEY(USER_ID),
        NOTE_ID.toString(),
      );
      await inMemoryDatabase.deleteHash(
        NOTE_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  test('Test If Method "getAllNotesFromInMemoryDatabase" Returns All Users\'s Notes', async () => {
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

    await inMemoryDatabase.addValueToSet(
      NOTE_IN_MEMORY_DATABASE_KEY(USER_ID),
      NOTE_ID.toString(),
    );

    const userNotes =
      await noteActiveRecord.getAllNotesFromInMemoryDatabase(USER_ID);
    expect(userNotes[0].id).toEqual(NOTE_ID);
    expect(userNotes[0].title).toEqual(NOTE_TITLE);
    expect(userNotes[0].body).toEqual(NOTE_BODY);
    expect(userNotes[0].createdAt).toEqual(NOTE_CREATED_AT);
    expect(userNotes[0].updatedAt).toEqual(NOTE_UPDATED_AT);
    expect(userNotes[0].userId).toEqual(USER_ID);
  });

  test('Test If Method "getNoteFromInMemoryDatabase" Returns Users\'s Note', async () => {
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

    await inMemoryDatabase.addValueToSet(
      NOTE_IN_MEMORY_DATABASE_KEY(USER_ID),
      NOTE_ID.toString(),
    );

    const userNote =
      await noteActiveRecord.getNoteFromInMemoryDatabase(NOTE_ID);

    expect(userNote.id).toEqual(NOTE_ID);
    expect(userNote.title).toEqual(NOTE_TITLE);
    expect(userNote.body).toEqual(NOTE_BODY);
    expect(userNote.createdAt).toEqual(NOTE_CREATED_AT);
    expect(userNote.updatedAt).toEqual(NOTE_UPDATED_AT);
    expect(userNote.userId).toEqual(USER_ID);
  });

  test('Test If Method "createNoteOnInMemoryDatabase" Creates Note On Database', async () => {
    const note = NoteEntityFactory.getInstance(
      NOTE_ID,
      NOTE_TITLE,
      NOTE_BODY,
      NOTE_CREATED_AT,
      NOTE_UPDATED_AT,
      USER_ID,
    );

    await noteActiveRecord.createNoteOnInMemoryDatabase(note);

    const retrievedHashOfNoteFromInMemoryDatabase =
      await inMemoryDatabase.getHash(NOTE_HASH_IN_MEMORY_DATABASE_KEY(NOTE_ID));

    const retrievedNote = NoteEntityFactory.getInstance(
      Number(retrievedHashOfNoteFromInMemoryDatabase[0].value),
      retrievedHashOfNoteFromInMemoryDatabase[1].value,
      retrievedHashOfNoteFromInMemoryDatabase[2].value,
      Number(retrievedHashOfNoteFromInMemoryDatabase[3].value),
      Number(retrievedHashOfNoteFromInMemoryDatabase[4].value),
      Number(retrievedHashOfNoteFromInMemoryDatabase[5].value),
    );

    expect(retrievedNote.id).toEqual(NOTE_ID);
    expect(retrievedNote.title).toEqual(NOTE_TITLE);
    expect(retrievedNote.body).toEqual(NOTE_BODY);
    expect(retrievedNote.createdAt).toEqual(NOTE_CREATED_AT);
    expect(retrievedNote.updatedAt).toEqual(NOTE_UPDATED_AT);
    expect(retrievedNote.userId).toEqual(USER_ID);
  });

  test('Test If Method "updateNoteOnInMemoryDatabase" Updates Note On Database', async () => {
    await inMemoryDatabase.addHash(NOTE_HASH_IN_MEMORY_DATABASE_KEY(NOTE_ID), [
      HashItemEntityFactory.getInstance(NOTE_ID_IN_MEMORY_DATABASE_KEY, ""),
      HashItemEntityFactory.getInstance(NOTE_TITLE_IN_MEMORY_DATABASE_KEY, ""),
      HashItemEntityFactory.getInstance(NOTE_BODY_IN_MEMORY_DATABASE_KEY, ""),
      HashItemEntityFactory.getInstance(
        NOTE_CREATED_AT_IN_MEMORY_DATABASE_KEY,
        "",
      ),
      HashItemEntityFactory.getInstance(
        NOTE_UPDATED_AT_IN_MEMORY_DATABASE_KEY,
        "",
      ),
      HashItemEntityFactory.getInstance(
        NOTE_USER_ID_IN_MEMORY_DATABASE_KEY,
        "",
      ),
    ]);

    await inMemoryDatabase.addValueToSet(
      NOTE_IN_MEMORY_DATABASE_KEY(USER_ID),
      NOTE_ID.toString(),
    );

    const note = NoteEntityFactory.getInstance(
      NOTE_ID,
      NOTE_TITLE,
      NOTE_BODY,
      NOTE_CREATED_AT,
      NOTE_UPDATED_AT,
      USER_ID,
    );

    await noteActiveRecord.updateNoteOnInMemoryDatabase(note);

    const retrievedHashOfNoteFromInMemoryDatabase =
      await inMemoryDatabase.getHash(NOTE_HASH_IN_MEMORY_DATABASE_KEY(NOTE_ID));

    const updatedNote = NoteEntityFactory.getInstance(
      Number(retrievedHashOfNoteFromInMemoryDatabase[0].value),
      retrievedHashOfNoteFromInMemoryDatabase[1].value,
      retrievedHashOfNoteFromInMemoryDatabase[2].value,
      Number(retrievedHashOfNoteFromInMemoryDatabase[3].value),
      Number(retrievedHashOfNoteFromInMemoryDatabase[4].value),
      Number(retrievedHashOfNoteFromInMemoryDatabase[5].value),
    );

    expect(updatedNote.id).toEqual(NOTE_ID);
    expect(updatedNote.title).toEqual(NOTE_TITLE);
    expect(updatedNote.body).toEqual(NOTE_BODY);
    expect(updatedNote.createdAt).toEqual(NOTE_CREATED_AT);
    expect(updatedNote.updatedAt).toEqual(NOTE_UPDATED_AT);
    expect(updatedNote.userId).toEqual(USER_ID);
  });

  test('Test If Method "deleteNoteOnInMemoryDatabase" Delete Note On Database', async () => {
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

    await inMemoryDatabase.addValueToSet(
      NOTE_IN_MEMORY_DATABASE_KEY(USER_ID),
      NOTE_ID.toString(),
    );

    await noteActiveRecord.deleteNoteOnInMemoryDatabase(NOTE_ID, USER_ID);

    try {
      await inMemoryDatabase.getHash(NOTE_HASH_IN_MEMORY_DATABASE_KEY(NOTE_ID));
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_HASH_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_HASH_ERROR_MESSAGE);
    }
  });
});

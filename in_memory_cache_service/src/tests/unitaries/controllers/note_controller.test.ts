import {
  describe,
  beforeAll,
  beforeEach,
  afterAll,
  test,
  expect,
} from "@jest/globals";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../../server/server";
import { NOTES_INDEX_ROUTE } from "../../../constants/routes_constants";
import {
  NOT_EXISTING_NOTE_ERROR_MESSAGE,
  NOT_EXISTING_NOTE_ERROR_NAME,
  NOTE_BODY,
  NOTE_CREATED_AT,
  NOTE_ID,
  NOTE_TITLE,
  NOTE_UPDATED_AT,
} from "../../../constants/domains/note_constants";
import {
  USER_ID,
  USER_USERNAME,
} from "../../../constants/domains/user_constants";
import UserRepository from "../../../domains/user/user_repository";
import NoteRepository from "../../../domains/note/note_repository";
import UserRepositoryFactory from "../../../domains/user/user_repository_factory";
import NoteRepositoryFactory from "../../../domains/note/note_repository_factory";
import UserEntityFactory from "../../../domains/user/user_entity_factory";
import NoteEntityFactory from "../../../domains/note/note_entity_factory";
import TestAgent from "supertest/lib/agent";

describe("Test Class NoteController Behavior", () => {
  let userRepository: UserRepository;
  let noteRepository: NoteRepository;
  let requestOnApp: TestAgent;

  beforeAll(async () => {
    userRepository = await UserRepositoryFactory.getInstance();
    noteRepository = await NoteRepositoryFactory.getInstance();

    requestOnApp = request(app);
  });

  beforeEach(async () => {
    try {
      await userRepository.deleteUser(USER_ID);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  afterAll(async () => {
    try {
      await userRepository.deleteUser(USER_ID);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  test('Test If Method "getAllNotes" Responds All Notes From User', async () => {
    const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);
    const note = NoteEntityFactory.getInstance(
      NOTE_ID,
      NOTE_TITLE,
      NOTE_BODY,
      NOTE_CREATED_AT,
      NOTE_UPDATED_AT,
      USER_ID,
    );

    await userRepository.createUser(user);
    await noteRepository.createNote(note);

    const response = await requestOnApp.get(`${NOTES_INDEX_ROUTE}${USER_ID}/`);

    expect(response.status).toEqual(StatusCodes.OK);
    expect(response.body[0].id).toEqual(NOTE_ID);
    expect(response.body[0].title).toEqual(NOTE_TITLE);
    expect(response.body[0].body).toEqual(NOTE_BODY);
    expect(response.body[0].createdAt).toEqual(NOTE_CREATED_AT);
    expect(response.body[0].updatedAt).toEqual(NOTE_UPDATED_AT);
    expect(response.body[0].userId).toEqual(USER_ID);
  });

  test('Test If Method "getAllNotes" Responds Not Found If User Does Not Exist', async () => {
    const response = await requestOnApp.get(`${NOTES_INDEX_ROUTE}${USER_ID}/`);

    expect(response.status).toEqual(StatusCodes.NOT_FOUND);
  });

  test('Test If Method "getNote" Responds Note From User', async () => {
    const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);
    const note = NoteEntityFactory.getInstance(
      NOTE_ID,
      NOTE_TITLE,
      NOTE_BODY,
      NOTE_CREATED_AT,
      NOTE_UPDATED_AT,
      USER_ID,
    );

    await userRepository.createUser(user);
    await noteRepository.createNote(note);

    const response = await requestOnApp.get(
      `${NOTES_INDEX_ROUTE}${USER_ID}/${NOTE_ID}`,
    );

    expect(response.status).toEqual(StatusCodes.OK);
    expect(response.body.id).toEqual(NOTE_ID);
    expect(response.body.title).toEqual(NOTE_TITLE);
    expect(response.body.body).toEqual(NOTE_BODY);
    expect(response.body.createdAt).toEqual(NOTE_CREATED_AT);
    expect(response.body.updatedAt).toEqual(NOTE_UPDATED_AT);
    expect(response.body.userId).toEqual(USER_ID);
  });

  test('Test If Method "getNote" Responds Not Found If User Or Note Does Not Exist', async () => {
    const response = await requestOnApp.get(
      `${NOTES_INDEX_ROUTE}${USER_ID}/${NOTE_ID}`,
    );

    expect(response.status).toEqual(StatusCodes.NOT_FOUND);
  });

  test('Test If Method "createNote" Creates Note On In-Memory Database', async () => {
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

    const response = await requestOnApp
      .post(`${NOTES_INDEX_ROUTE}${USER_ID}/`)
      .send(note);

    const retrievedNote = await noteRepository.getNote(NOTE_ID);

    expect(response.status).toEqual(StatusCodes.CREATED);
    expect(retrievedNote.id).toEqual(NOTE_ID);
    expect(retrievedNote.title).toEqual(NOTE_TITLE);
    expect(retrievedNote.body).toEqual(NOTE_BODY);
    expect(retrievedNote.createdAt).toEqual(NOTE_CREATED_AT);
    expect(retrievedNote.updatedAt).toEqual(NOTE_UPDATED_AT);
    expect(retrievedNote.userId).toEqual(USER_ID);
  });

  test('Test If Method "createNote" Responds Not Found If User Does Not Exist', async () => {
    const note = NoteEntityFactory.getInstance(
      NOTE_ID,
      NOTE_TITLE,
      NOTE_BODY,
      NOTE_CREATED_AT,
      NOTE_UPDATED_AT,
      USER_ID,
    );

    const response = await requestOnApp
      .post(`${NOTES_INDEX_ROUTE}${USER_ID}/`)
      .send(note);

    expect(response.status).toEqual(StatusCodes.NOT_FOUND);
  });

  test('Test If Method "createNote" Responds Conflict If Note Already Exists', async () => {
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

    const response = await requestOnApp
      .post(`${NOTES_INDEX_ROUTE}${USER_ID}/`)
      .send(note);

    expect(response.status).toEqual(StatusCodes.CONFLICT);
  });

  test('Test If Method "updateNote" Updates Note On In-Memory Database', async () => {
    const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    await userRepository.createUser(user);

    const note = NoteEntityFactory.getInstance(
      NOTE_ID,
      "",
      "",
      NOTE_CREATED_AT,
      NOTE_UPDATED_AT,
      USER_ID,
    );

    await noteRepository.createNote(note);

    const updatedNote = NoteEntityFactory.getInstance(
      NOTE_ID,
      NOTE_TITLE,
      NOTE_BODY,
      NOTE_CREATED_AT,
      NOTE_UPDATED_AT,
      USER_ID,
    );

    const response = await requestOnApp
      .patch(`${NOTES_INDEX_ROUTE}${USER_ID}/${NOTE_ID}`)
      .send(updatedNote);

    expect(response.status).toEqual(StatusCodes.OK);

    const retrievedNote = await noteRepository.getNote(NOTE_ID);

    expect(retrievedNote.id).toEqual(NOTE_ID);
    expect(retrievedNote.title).toEqual(NOTE_TITLE);
    expect(retrievedNote.body).toEqual(NOTE_BODY);
    expect(retrievedNote.createdAt).toEqual(NOTE_CREATED_AT);
    expect(retrievedNote.updatedAt).toEqual(NOTE_UPDATED_AT);
    expect(retrievedNote.userId).toEqual(USER_ID);
  });

  test('Test If Method "updateNote" Responds Not Found If User Or Note Does Not Exist', async () => {
    const response = await requestOnApp.patch(
      `${NOTES_INDEX_ROUTE}${USER_ID}/${NOTE_ID}`,
    );

    expect(response.status).toEqual(StatusCodes.NOT_FOUND);
  });

  test('Test If Method "deleteNote" Deletes Note On In-Memory Database', async () => {
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

    const response = await requestOnApp.delete(
      `${NOTES_INDEX_ROUTE}${USER_ID}/${NOTE_ID}`,
    );

    expect(response.status).toEqual(StatusCodes.OK);

    try {
      await noteRepository.getNote(NOTE_ID);
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_NOTE_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_NOTE_ERROR_MESSAGE);
    }
  });

  test('Test If Method "deleteNote" Responds Not Found If User Or Note Does Not Exist', async () => {
    const response = await requestOnApp.delete(
      `${NOTES_INDEX_ROUTE}${USER_ID}/${NOTE_ID}`,
    );

    expect(response.status).toEqual(StatusCodes.NOT_FOUND);
  });
});

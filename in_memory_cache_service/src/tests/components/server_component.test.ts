import {
  describe,
  beforeAll,
  beforeEach,
  afterAll,
  test,
  expect,
} from "@jest/globals";
import request from "supertest";
import UserRepositoryFactory from "../../domains/user/user_repository_factory";
import NoteRepository from "../../domains/note/note_repository";
import NoteRepositoryFactory from "../../domains/note/note_repository_factory";
import {
  NOT_EXISTING_USER_ERROR_MESSAGE,
  NOT_EXISTING_USER_ERROR_NAME,
  USER_ID,
  USER_USERNAME,
} from "../../constants/domains/user_constants";
import TestAgent from "supertest/lib/agent";
import { app } from "../../server/server";
import UserEntityFactory from "../../domains/user/user_entity_factory";
import {
  NOTES_INDEX_ROUTE,
  USERS_INDEX_ROUTE,
} from "../../constants/routes_constants";
import { StatusCodes } from "http-status-codes";
import UserRepository from "../../domains/user/user_repository";
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

describe("Test Component Server Behavior", () => {
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

  test("Test Creating User", async () => {
    const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    const response = await requestOnApp.post(`${USERS_INDEX_ROUTE}`).send(user);

    const retrievedUser = await userRepository.getUser(USER_ID);

    expect(response.status).toEqual(StatusCodes.CREATED);
    expect(retrievedUser.id).toEqual(USER_ID);
    expect(retrievedUser.username).toEqual(USER_USERNAME);
  });

  test("Test Fetching All Users", async () => {
    const users = await userRepository.getUsers();

    const response = await requestOnApp.get(`${USERS_INDEX_ROUTE}`);

    expect(response.status).toEqual(StatusCodes.OK);
    expect(response.body).toEqual(users);
  });

  test("Test Fetching User", async () => {
    const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    await userRepository.createUser(user);

    const response = await requestOnApp.get(`${USERS_INDEX_ROUTE}${USER_ID}/`);

    expect(response.status).toEqual(StatusCodes.OK);
    expect(response.body.id).toEqual(USER_ID);
    expect(response.body.username).toEqual(USER_USERNAME);
  });

  test("Test Updating User", async () => {
    const user = UserEntityFactory.getInstance(USER_ID, "");

    await userRepository.createUser(user);

    const updatedUser = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    const response = await requestOnApp
      .patch(`${USERS_INDEX_ROUTE}${USER_ID}`)
      .send(updatedUser);

    const retrievedUser = await userRepository.getUser(USER_ID);

    expect(response.status).toEqual(StatusCodes.OK);
    expect(retrievedUser.id).toEqual(USER_ID);
    expect(retrievedUser.username).toEqual(USER_USERNAME);
  });

  test("Test Deleting User", async () => {
    const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    await userRepository.createUser(user);

    const response = await requestOnApp.delete(
      `${USERS_INDEX_ROUTE}${USER_ID}`,
    );

    expect(response.status).toEqual(StatusCodes.NO_CONTENT);

    try {
      await userRepository.getUser(USER_ID);
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_USER_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_USER_ERROR_MESSAGE);
    }
  });

  test("Test Creating Note", async () => {
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

  test("Test Fetching All User Notes", async () => {
    const notes = await noteRepository.getNotes(USER_ID);

    const response = await requestOnApp.get(`${NOTES_INDEX_ROUTE}${USER_ID}/`);

    expect(response.status).toEqual(StatusCodes.OK);
    expect(response.body).toEqual(notes);
  });

  test("Test Fetching Note", async () => {
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

  test("Test Updating Note", async () => {
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

  test("Test Updating Note", async () => {
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
});

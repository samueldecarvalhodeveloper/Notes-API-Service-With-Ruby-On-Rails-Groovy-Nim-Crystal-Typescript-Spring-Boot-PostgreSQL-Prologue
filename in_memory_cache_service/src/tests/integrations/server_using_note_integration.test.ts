import { describe, beforeAll, afterAll, test, expect } from "@jest/globals";
import request from "supertest";
import UserRepositoryFactory from "../../domains/user/user_repository_factory";
import NoteRepositoryFactory from "../../domains/note/note_repository_factory";
import UserRepository from "../../domains/user/user_repository";
import NoteRepository from "../../domains/note/note_repository";
import UserEntityFactory from "../../domains/user/user_entity_factory";
import { USER_ID, USER_USERNAME } from "../../constants/domains/user_constants";
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
import { app } from "../../server/server";
import { NOTES_INDEX_ROUTE } from "../../constants/routes_constants";
import { StatusCodes } from "http-status-codes";

describe('Test If Integration Of "Server Using Note" Behavior', () => {
  let userRepository: UserRepository;
  let noteRepository: NoteRepository;

  beforeAll(async () => {
    userRepository = await UserRepositoryFactory.getInstance();
    noteRepository = await NoteRepositoryFactory.getInstance();

    try {
      const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

      await userRepository.createUser(user);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}

    try {
      const note = NoteEntityFactory.getInstance(
        NOTE_ID,
        "",
        "",
        NOTE_CREATED_AT,
        NOTE_UPDATED_AT,
        USER_ID,
      );

      await noteRepository.createNote(note);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  afterAll(async () => {
    try {
      await userRepository.deleteUser(USER_ID);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}

    try {
      await noteRepository.deleteNote(NOTE_ID, USER_ID);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  test("Test If Server Can Use Note", async () => {
    const requestOnApp = request(app);

    const getAllNotesResponse = await requestOnApp.get(
      `${NOTES_INDEX_ROUTE}${USER_ID}/`,
    );

    expect(getAllNotesResponse.status).toEqual(StatusCodes.OK);
    expect(getAllNotesResponse.body[0].id).toEqual(NOTE_ID);
    expect(getAllNotesResponse.body[0].title).toEqual("");
    expect(getAllNotesResponse.body[0].body).toEqual("");
    expect(getAllNotesResponse.body[0].createdAt).toEqual(NOTE_CREATED_AT);
    expect(getAllNotesResponse.body[0].updatedAt).toEqual(NOTE_UPDATED_AT);
    expect(getAllNotesResponse.body[0].userId).toEqual(USER_ID);

    const getNoteResponse = await requestOnApp.get(
      `${NOTES_INDEX_ROUTE}${USER_ID}/${NOTE_ID}/`,
    );

    expect(getNoteResponse.status).toEqual(StatusCodes.OK);
    expect(getNoteResponse.body.id).toEqual(NOTE_ID);
    expect(getNoteResponse.body.title).toEqual("");
    expect(getNoteResponse.body.body).toEqual("");
    expect(getNoteResponse.body.createdAt).toEqual(NOTE_CREATED_AT);
    expect(getNoteResponse.body.updatedAt).toEqual(NOTE_UPDATED_AT);
    expect(getNoteResponse.body.userId).toEqual(USER_ID);

    const note = NoteEntityFactory.getInstance(
      NOTE_ID,
      "",
      "",
      NOTE_CREATED_AT,
      NOTE_UPDATED_AT,
      USER_ID,
    );

    const createNoteResponse = await requestOnApp
      .post(`${NOTES_INDEX_ROUTE}${USER_ID}/`)
      .send(note);

    expect(createNoteResponse.status).toEqual(StatusCodes.CONFLICT);

    const updatedNote = NoteEntityFactory.getInstance(
      NOTE_ID,
      NOTE_TITLE,
      NOTE_BODY,
      NOTE_CREATED_AT,
      NOTE_UPDATED_AT,
      USER_ID,
    );

    const updateNoteResponse = await requestOnApp
      .patch(`${NOTES_INDEX_ROUTE}${USER_ID}/${NOTE_ID}/`)
      .send(updatedNote);

    expect(updateNoteResponse.status).toEqual(StatusCodes.OK);

    const updateNoteOnInMemoryDatabase = await noteRepository.getNote(NOTE_ID);

    expect(updateNoteOnInMemoryDatabase.id).toEqual(NOTE_ID);
    expect(updateNoteOnInMemoryDatabase.title).toEqual(NOTE_TITLE);
    expect(updateNoteOnInMemoryDatabase.body).toEqual(NOTE_BODY);
    expect(updateNoteOnInMemoryDatabase.createdAt).toEqual(NOTE_CREATED_AT);
    expect(updateNoteOnInMemoryDatabase.updatedAt).toEqual(NOTE_UPDATED_AT);
    expect(updateNoteOnInMemoryDatabase.userId).toEqual(USER_ID);

    const deleteNoteResponse = await requestOnApp.delete(
      `${NOTES_INDEX_ROUTE}${USER_ID}/${NOTE_ID}/`,
    );

    expect(deleteNoteResponse.status).toEqual(StatusCodes.OK);

    try {
      await noteRepository.getNote(NOTE_ID);
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_NOTE_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_NOTE_ERROR_MESSAGE);
    }
  });
});

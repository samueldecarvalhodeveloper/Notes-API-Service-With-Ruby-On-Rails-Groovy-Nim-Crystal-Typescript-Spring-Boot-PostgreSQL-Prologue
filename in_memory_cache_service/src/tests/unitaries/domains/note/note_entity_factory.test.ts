import { describe, test, expect } from "@jest/globals";
import NoteEntityFactory from "../../../../domains/note/note_entity_factory";
import {
  NOTE_BODY,
  NOTE_CREATED_AT,
  NOTE_ID,
  NOTE_TITLE,
  NOTE_UPDATED_AT,
} from "../../../../constants/domains/note_constants";
import { USER_ID } from "../../../../constants/domains/user_constants";

describe("Test Class NoteEntityFactory Behavior", () => {
  test('Test If Method "getInstance" Returns A Working Instance', () => {
    const note = NoteEntityFactory.getInstance(
      NOTE_ID,
      NOTE_TITLE,
      NOTE_BODY,
      NOTE_CREATED_AT,
      NOTE_UPDATED_AT,
      USER_ID,
    );

    expect(note.id).toEqual(NOTE_ID);
    expect(note.title).toEqual(NOTE_TITLE);
    expect(note.body).toEqual(NOTE_BODY);
    expect(note.createdAt).toEqual(NOTE_CREATED_AT);
    expect(note.updatedAt).toEqual(NOTE_UPDATED_AT);
    expect(note.userId).toEqual(USER_ID);
  });
});

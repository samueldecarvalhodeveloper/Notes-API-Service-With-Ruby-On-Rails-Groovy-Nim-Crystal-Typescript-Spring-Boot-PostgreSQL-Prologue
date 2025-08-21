import { describe, test, expect } from "@jest/globals";
import AlreadyExistingNoteError from "../../../../../../domains/note/infrastructure/errors/already_existing_note_error";
import {
  ALREADY_EXISTING_NOTE_ERROR_MESSAGE,
  ALREADY_EXISTING_NOTE_ERROR_NAME,
} from "../../../../../../constants/domains/note_constants";

describe("Test Class AlreadyExistingNoteError Behavior", () => {
  test("Test If Error Describes How Should A Already Existing Note Error Be Used By The System", () => {
    try {
      throw new AlreadyExistingNoteError();
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(ALREADY_EXISTING_NOTE_ERROR_NAME);
      expect(castedError.message).toEqual(ALREADY_EXISTING_NOTE_ERROR_MESSAGE);
    }
  });
});

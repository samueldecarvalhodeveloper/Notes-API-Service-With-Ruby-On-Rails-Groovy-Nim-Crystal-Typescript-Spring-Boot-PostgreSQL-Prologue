import { describe, test, expect } from "@jest/globals";
import {
  NOT_EXISTING_NOTE_ERROR_MESSAGE,
  NOT_EXISTING_NOTE_ERROR_NAME,
} from "../../../../../../constants/domains/note_constants";
import NotExistingNoteError from "../../../../../../domains/note/infrastructure/errors/not_existing_note_error";

describe("Test Class NotExistingNoteError Behavior", () => {
  test("Test If Error Describes How Should A Not Existing Note Error Be Used By The System", () => {
    try {
      throw new NotExistingNoteError();
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_NOTE_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_NOTE_ERROR_MESSAGE);
    }
  });
});

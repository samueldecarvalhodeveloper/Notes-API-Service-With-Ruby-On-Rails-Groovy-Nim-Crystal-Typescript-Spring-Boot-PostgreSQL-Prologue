import { describe, test, expect } from "@jest/globals";
import VerifyIfUserExistsAdapter from "../../../../domains/note/verify_if_user_exists_adapter";
import {
  NOT_EXISTING_USER_ERROR_MESSAGE,
  NOT_EXISTING_USER_ERROR_NAME,
  USER_ID,
} from "../../../../constants/domains/user_constants";

describe("Test Class VerifyIfUserExistsAdapter Behavior", () => {
  test('Test If Method "verifyIfUserExists" Throws Not Existing User If User Does Not Exist On In-Memory Database', async () => {
    try {
      await VerifyIfUserExistsAdapter.verifyIfUserExists(USER_ID);
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_USER_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_USER_ERROR_MESSAGE);
    }
  });
});

import { describe, test, expect } from "@jest/globals";
import {
  NOT_EXISTING_USER_ERROR_MESSAGE,
  NOT_EXISTING_USER_ERROR_NAME,
} from "../../../../../../constants/domains/user_constants";
import NotExistingUserError from "../../../../../../domains/user/infrastructure/errors/not_existing_user_error";

describe("Test Class NotExistingUserError Behavior", () => {
  test("Test If Error Describes How Should A Not Existing User Error Be Used By The System", () => {
    try {
      throw new NotExistingUserError();
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_USER_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_USER_ERROR_MESSAGE);
    }
  });
});

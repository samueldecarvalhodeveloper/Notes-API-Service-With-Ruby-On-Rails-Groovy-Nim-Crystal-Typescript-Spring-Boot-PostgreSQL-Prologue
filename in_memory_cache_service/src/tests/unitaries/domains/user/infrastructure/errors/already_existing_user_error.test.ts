import { describe, test, expect } from "@jest/globals";
import AlreadyExistingUserError from "../../../../../../domains/user/infrastructure/errors/already_existing_user_error";
import {
  ALREADY_EXISTING_USER_ERROR_MESSAGE,
  ALREADY_EXISTING_USER_ERROR_NAME,
} from "../../../../../../constants/domains/user_constants";

describe("Test Class AlreadyExistingUserError Behavior", () => {
  test("Test If Error Describes How Should A Already Existing User Error Be Used By The System", () => {
    try {
      throw new AlreadyExistingUserError();
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(ALREADY_EXISTING_USER_ERROR_NAME);
      expect(castedError.message).toEqual(ALREADY_EXISTING_USER_ERROR_MESSAGE);
    }
  });
});

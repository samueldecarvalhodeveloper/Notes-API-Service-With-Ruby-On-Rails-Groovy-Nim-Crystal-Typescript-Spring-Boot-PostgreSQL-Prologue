import { describe, test, expect } from "@jest/globals";
import {
  ALREADY_EXISTING_VALUE_ERROR_MESSAGE,
  ALREADY_EXISTING_VALUE_ERROR_NAME,
} from "../../../../../../constants/domains/in_memory_database_constants";
import AlreadyExistingValueError from "../../../../../../domains/in_memory_database/infrastructure/errors/already_existing_value_error";

describe("Test Class AlreadyExistingValueError Behavior", () => {
  test("Test If Error Describes How Should A Already Existing Value Error Be Used By The System", () => {
    try {
      throw new AlreadyExistingValueError();
    } catch (error) {
      const errorCasted = error as Error;

      expect(errorCasted.name).toEqual(ALREADY_EXISTING_VALUE_ERROR_NAME);
      expect(errorCasted.message).toEqual(ALREADY_EXISTING_VALUE_ERROR_MESSAGE);
    }
  });
});

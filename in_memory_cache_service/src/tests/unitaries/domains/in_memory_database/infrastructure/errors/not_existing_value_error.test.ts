import { describe, test, expect } from "@jest/globals";
import NotExistingValueError from "../../../../../../domains/in_memory_database/infrastructure/errors/not_existing_value_error";
import {
  NOT_EXISTING_VALUE_ERROR_MESSAGE,
  NOT_EXISTING_VALUE_ERROR_NAME,
} from "../../../../../../constants/domains/in_memory_database_constants";

describe("Test Class NotExistingValueError Behavior", () => {
  test("Test If Error Describes How Should A Not Existing Value Error Be Used By The System", () => {
    try {
      throw new NotExistingValueError();
    } catch (error) {
      const errorCasted = error as Error;

      expect(errorCasted.name).toEqual(NOT_EXISTING_VALUE_ERROR_NAME);
      expect(errorCasted.message).toEqual(NOT_EXISTING_VALUE_ERROR_MESSAGE);
    }
  });
});

import { describe, test, expect } from "@jest/globals";
import {
  NOT_EXISTING_HASH_ERROR_MESSAGE,
  NOT_EXISTING_HASH_ERROR_NAME,
} from "../../../../../../constants/domains/in_memory_database_constants";
import NotExistingHashError from "../../../../../../domains/in_memory_database/infrastructure/errors/not_existing_hash_error";

describe("Test Class NotExistingHashError Behavior", () => {
  test("Test If Error Describes How Should A Not Existing Hash Error Be Used By The System", () => {
    try {
      throw new NotExistingHashError();
    } catch (error) {
      const errorCasted = error as Error;

      expect(errorCasted.name).toEqual(NOT_EXISTING_HASH_ERROR_NAME);
      expect(errorCasted.message).toEqual(NOT_EXISTING_HASH_ERROR_MESSAGE);
    }
  });
});

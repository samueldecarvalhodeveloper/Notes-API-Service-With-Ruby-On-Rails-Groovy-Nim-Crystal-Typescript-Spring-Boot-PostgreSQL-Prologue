import { describe, test, expect } from "@jest/globals";
import AlreadyExistingHashError from "../../../../../../domains/in_memory_database/infrastructure/errors/already_existing_hash_error";
import {
  ALREADY_EXISTING_HASH_ERROR_MESSAGE,
  ALREADY_EXISTING_HASH_ERROR_NAME,
} from "../../../../../../constants/domains/in_memory_database_constants";

describe("Test Class AlreadyExistingHashError Behavior", () => {
  test("Test If Error Describes How Should A Already Existing Hash Error Be Used By The System", () => {
    try {
      throw new AlreadyExistingHashError();
    } catch (error) {
      const errorCasted = error as Error;

      expect(errorCasted.name).toEqual(ALREADY_EXISTING_HASH_ERROR_NAME);
      expect(errorCasted.message).toEqual(ALREADY_EXISTING_HASH_ERROR_MESSAGE);
    }
  });
});

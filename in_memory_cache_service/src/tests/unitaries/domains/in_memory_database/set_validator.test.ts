import {
  describe,
  beforeAll,
  beforeEach,
  afterAll,
  test,
  expect,
} from "@jest/globals";
import { createClient, RedisClientType } from "redis";
import {
  IN_MEMORY_DATABASE_HOST_PORT,
  IN_MEMORY_DATABASE_HOST_NAME,
  IN_MEMORY_DATABASE_URL,
} from "../../../../constants/application_constants";
import {
  USER_ID,
  USER_IN_MEMORY_DATABASE_KEY,
} from "../../../../constants/domains/user_constants";
import SetValidator from "../../../../domains/in_memory_database/set_validator";
import {
  NOT_EXISTING_HASH_ERROR_MESSAGE,
  NOT_EXISTING_HASH_ERROR_NAME,
  NOT_EXISTING_VALUE_ERROR_MESSAGE,
  NOT_EXISTING_VALUE_ERROR_NAME,
} from "../../../../constants/domains/in_memory_database_constants";

describe("", () => {
  let inMemoryDatabaseImplementation: RedisClientType<any>;

  beforeAll(async () => {
    inMemoryDatabaseImplementation = (await createClient({
      url: IN_MEMORY_DATABASE_URL(
        IN_MEMORY_DATABASE_HOST_NAME,
        IN_MEMORY_DATABASE_HOST_PORT,
      ),
    }).connect()) as RedisClientType<any>;
  });

  beforeEach(async () => {
    await inMemoryDatabaseImplementation.del(USER_IN_MEMORY_DATABASE_KEY);
  });

  afterAll(async () => {
    await inMemoryDatabaseImplementation.del(USER_IN_MEMORY_DATABASE_KEY);
  });

  test('Test If Method "throwNotExistingValueErrorIfValueIsNotOnSetFromDatabase" If Value Does Not Exist On Set On In-Memory Database', async () => {
    try {
      await SetValidator.throwNotExistingValueErrorIfValueIsNotOnSetFromDatabase(
        USER_IN_MEMORY_DATABASE_KEY,
        USER_ID.toString(),
        inMemoryDatabaseImplementation,
      );
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_VALUE_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_VALUE_ERROR_MESSAGE);
    }
  });

  test('Test If Method "throwAlreadyExistingValueErrorIfValueIsAlreadyOnSetFromDatabase" If Value Already Exists On Set On In-Memory Database', async () => {
    try {
      await inMemoryDatabaseImplementation.sAdd(
        USER_IN_MEMORY_DATABASE_KEY,
        USER_ID.toString(),
      );

      await SetValidator.throwNotExistingValueErrorIfValueIsNotOnSetFromDatabase(
        USER_IN_MEMORY_DATABASE_KEY,
        USER_ID.toString(),
        inMemoryDatabaseImplementation,
      );
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_HASH_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_HASH_ERROR_MESSAGE);
    }
  });
});

import {
  describe,
  beforeAll,
  beforeEach,
  afterAll,
  test,
  expect,
} from "@jest/globals";
import HashValidator from "../../../../domains/in_memory_database/hash_validator";
import {
  ALREADY_EXISTING_HASH_ERROR_MESSAGE,
  ALREADY_EXISTING_HASH_ERROR_NAME,
  NOT_EXISTING_HASH_ERROR_MESSAGE,
  NOT_EXISTING_HASH_ERROR_NAME,
} from "../../../../constants/domains/in_memory_database_constants";
import {
  USER_HASH_IN_MEMORY_DATABASE_KEY,
  USER_ID,
  USER_ID_IN_MEMORY_DATABASE_KEY,
  USER_USERNAME,
  USER_USERNAME_IN_MEMORY_DATABASE_KEY,
} from "../../../../constants/domains/user_constants";
import { createClient, RedisClientType } from "redis";
import {
  IN_MEMORY_DATABASE_HOST_NAME,
  IN_MEMORY_DATABASE_HOST_PORT,
  IN_MEMORY_DATABASE_URL,
} from "../../../../constants/application_constants";

describe("Test Module InMemoryDatabaseSpecifications Behavior", () => {
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
    await inMemoryDatabaseImplementation.del(
      USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
    );
  });

  afterAll(async () => {
    await inMemoryDatabaseImplementation.del(
      USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
    );
  });

  test('Test If Method "throwANotExistingHashErrorIfHashIsNotOnDatabase" Throws An Not Existing Hash Error If Hash Does Not Exist On In-Memory Database', async () => {
    try {
      await HashValidator.throwANotExistingHashErrorIfHashIsNotOnDatabase(
        USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
        inMemoryDatabaseImplementation,
      );
    } catch (error) {
      const errorCasted = error as Error;

      expect(errorCasted.name).toEqual(NOT_EXISTING_HASH_ERROR_NAME);
      expect(errorCasted.message).toEqual(NOT_EXISTING_HASH_ERROR_MESSAGE);
    }
  });

  test('Test If Method "throwAnAlreadyExistingHashErrorIfHashIsAlreadyOnDatabase" Throws An Already Existing Hash Error If Hash Exists On In-Memory Database', async () => {
    try {
      await inMemoryDatabaseImplementation.hSet(
        USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
        USER_ID_IN_MEMORY_DATABASE_KEY,
        USER_ID,
      );

      await inMemoryDatabaseImplementation.hSet(
        USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
        USER_USERNAME_IN_MEMORY_DATABASE_KEY,
        USER_USERNAME,
      );

      await HashValidator.throwAnAlreadyExistingHashErrorIfHashIsAlreadyOnDatabase(
        USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
        inMemoryDatabaseImplementation,
      );
    } catch (error) {
      const errorCasted = error as Error;

      expect(errorCasted.name).toEqual(ALREADY_EXISTING_HASH_ERROR_NAME);
      expect(errorCasted.message).toEqual(ALREADY_EXISTING_HASH_ERROR_MESSAGE);
    }
  });
});

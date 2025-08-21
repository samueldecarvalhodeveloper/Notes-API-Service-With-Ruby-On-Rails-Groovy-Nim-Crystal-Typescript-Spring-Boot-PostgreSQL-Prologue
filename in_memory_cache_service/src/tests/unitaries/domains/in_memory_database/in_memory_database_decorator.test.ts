import {
  describe,
  beforeAll,
  beforeEach,
  afterAll,
  test,
  expect,
} from "@jest/globals";
import {
  USER_HASH_IN_MEMORY_DATABASE_KEY,
  USER_ID,
  USER_ID_IN_MEMORY_DATABASE_KEY,
  USER_IN_MEMORY_DATABASE_KEY,
  USER_USERNAME,
  USER_USERNAME_IN_MEMORY_DATABASE_KEY,
} from "../../../../constants/domains/user_constants";
import InMemoryDatabase from "../../../../domains/in_memory_database/in_memory_database";
import { createClient, RedisClientType } from "redis";
import {
  IN_MEMORY_DATABASE_HOST_NAME,
  IN_MEMORY_DATABASE_HOST_PORT,
  IN_MEMORY_DATABASE_URL,
} from "../../../../constants/application_constants";
import {
  ALREADY_EXISTING_HASH_ERROR_MESSAGE,
  ALREADY_EXISTING_HASH_ERROR_NAME,
  ALREADY_EXISTING_VALUE_ERROR_MESSAGE,
  ALREADY_EXISTING_VALUE_ERROR_NAME,
  NOT_EXISTING_HASH_ERROR_MESSAGE,
  NOT_EXISTING_HASH_ERROR_NAME,
  NOT_EXISTING_VALUE_ERROR_MESSAGE,
  NOT_EXISTING_VALUE_ERROR_NAME,
} from "../../../../constants/domains/in_memory_database_constants";
import InMemoryDatabaseDecorator from "../../../../domains/in_memory_database/in_memory_database_decorator";
import HashItemEntityFactory from "../../../../domains/in_memory_database/hash_item_entity_factory";

describe("Test Class InMemoryDatabaseDecorator Behavior", () => {
  let inMemoryDatabase: InMemoryDatabase;
  let inMemoryDatabaseImplementation: RedisClientType<any>;

  beforeAll(async () => {
    inMemoryDatabaseImplementation = (await createClient({
      url: IN_MEMORY_DATABASE_URL(
        IN_MEMORY_DATABASE_HOST_NAME,
        IN_MEMORY_DATABASE_HOST_PORT,
      ),
    }).connect()) as RedisClientType<any>;

    inMemoryDatabase = new InMemoryDatabaseDecorator(
      inMemoryDatabaseImplementation,
    );
  });

  beforeEach(async () => {
    await inMemoryDatabaseImplementation.del(USER_IN_MEMORY_DATABASE_KEY);

    await inMemoryDatabaseImplementation.del(
      USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
    );
  });

  afterAll(async () => {
    await inMemoryDatabaseImplementation.del(USER_IN_MEMORY_DATABASE_KEY);

    await inMemoryDatabaseImplementation.del(
      USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
    );
  });

  test('Test If Method "addValueToSet" Throws Already Existing Value Error If Value Is Already On Set', async () => {
    try {
      await inMemoryDatabase.addValueToSet(
        USER_IN_MEMORY_DATABASE_KEY,
        USER_ID.toString(),
      );

      await inMemoryDatabase.addValueToSet(
        USER_IN_MEMORY_DATABASE_KEY,
        USER_ID.toString(),
      );
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(ALREADY_EXISTING_VALUE_ERROR_NAME);
      expect(castedError.message).toEqual(ALREADY_EXISTING_VALUE_ERROR_MESSAGE);
    }
  });

  test('Test If Method "deleteValueFromSet" Throws Not Existing Value Error If Value Is Not On Set', async () => {
    try {
      await inMemoryDatabase.deleteValueFromSet(
        USER_IN_MEMORY_DATABASE_KEY,
        USER_ID.toString(),
      );
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_VALUE_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_VALUE_ERROR_MESSAGE);
    }
  });

  test('Test If Method "getHash" Throws Not Existing Hash Error If Hash Is Not On In-Memory Database', async () => {
    try {
      await inMemoryDatabase.getHash(USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID));
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_HASH_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_HASH_ERROR_MESSAGE);
    }
  });

  test('Test If Method "addHash" Throws Already Existing Hash Error If Hash Is Not On In-Memory Database', async () => {
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

      const userIdHashItem = HashItemEntityFactory.getInstance(
        USER_ID_IN_MEMORY_DATABASE_KEY,
        USER_ID.toString(),
      );
      const userUsernameHashItem = HashItemEntityFactory.getInstance(
        USER_USERNAME_IN_MEMORY_DATABASE_KEY,
        USER_USERNAME,
      );

      await inMemoryDatabase.addHash(
        USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
        [userIdHashItem, userUsernameHashItem],
      );
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(ALREADY_EXISTING_HASH_ERROR_NAME);
      expect(castedError.message).toEqual(ALREADY_EXISTING_HASH_ERROR_MESSAGE);
    }
  });

  test('Test If Method "updateHash" Throws Not Existing Hash Error If Hash Is Not On In-Memory Database', async () => {
    try {
      const userIdHashItem = HashItemEntityFactory.getInstance(
        USER_ID_IN_MEMORY_DATABASE_KEY,
        USER_ID.toString(),
      );
      const userUsernameHashItem = HashItemEntityFactory.getInstance(
        USER_USERNAME_IN_MEMORY_DATABASE_KEY,
        USER_USERNAME,
      );

      await inMemoryDatabase.updateHash(
        USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
        [userIdHashItem, userUsernameHashItem],
      );
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_HASH_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_HASH_ERROR_MESSAGE);
    }
  });

  test('Test If Method "Delete" Throws Not Existing Hash Error If Hash Is Not On In-Memory Database', async () => {
    try {
      await inMemoryDatabase.deleteHash(
        USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
      );
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_HASH_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_HASH_ERROR_MESSAGE);
    }
  });
});

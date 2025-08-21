import {
  describe,
  beforeAll,
  beforeEach,
  afterAll,
  test,
  expect,
} from "@jest/globals";
import InMemoryDatabaseFactory from "../../../../domains/in_memory_database/in_memory_database_factory";
import {
  IN_MEMORY_DATABASE_HOST_NAME,
  IN_MEMORY_DATABASE_HOST_PORT,
  IN_MEMORY_DATABASE_URL,
} from "../../../../constants/application_constants";
import { RedisClientType } from "@redis/client";
import { createClient } from "redis";
import {
  USER_ID,
  USER_IN_MEMORY_DATABASE_KEY,
} from "../../../../constants/domains/user_constants";

describe("Test Class InMemoryDatabaseDecorator behavior", () => {
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

  test('Test If Method "getInstance" Returns A Working Instance', async () => {
    const inMemoryDatabase = await InMemoryDatabaseFactory.getInstance(
      IN_MEMORY_DATABASE_HOST_NAME,
      IN_MEMORY_DATABASE_HOST_PORT,
    );

    await inMemoryDatabase.addValueToSet(
      USER_IN_MEMORY_DATABASE_KEY,
      USER_ID.toString(),
    );

    const usersSet = await inMemoryDatabase.getAllSetValues(
      USER_IN_MEMORY_DATABASE_KEY,
    );

    expect(usersSet[0]).toEqual(USER_ID.toString());
  });
});

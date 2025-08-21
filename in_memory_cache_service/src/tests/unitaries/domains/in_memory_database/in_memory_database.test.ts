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
import HashItemEntityFactory from "../../../../domains/in_memory_database/hash_item_entity_factory";

describe("Test Class InMemoryDatabase Behavior", () => {
  let inMemoryDatabase: InMemoryDatabase;
  let inMemoryDatabaseImplementation: RedisClientType<any>;

  beforeAll(async () => {
    inMemoryDatabaseImplementation = (await createClient({
      url: IN_MEMORY_DATABASE_URL(
        IN_MEMORY_DATABASE_HOST_NAME,
        IN_MEMORY_DATABASE_HOST_PORT,
      ),
    }).connect()) as RedisClientType<any>;

    inMemoryDatabase = new InMemoryDatabase(inMemoryDatabaseImplementation);
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

  test('Test If Method "getAllSetValues" Returns All Values From Set In In-Memory Database', async () => {
    await inMemoryDatabaseImplementation.sAdd(
      USER_IN_MEMORY_DATABASE_KEY,
      USER_ID.toString(),
    );

    const allSetValues = await inMemoryDatabase.getAllSetValues(
      USER_IN_MEMORY_DATABASE_KEY,
    );

    expect(allSetValues[0]).toEqual(USER_ID.toString());
  });

  test('Test If Method "addValueToSet" Adds Value To Set', async () => {
    await inMemoryDatabase.addValueToSet(
      USER_IN_MEMORY_DATABASE_KEY,
      USER_ID.toString(),
    );

    const allSetValues = await inMemoryDatabaseImplementation.sMembers(
      USER_IN_MEMORY_DATABASE_KEY,
    );

    expect(allSetValues[0]).toEqual(USER_ID.toString());
  });

  test('Test If Method "deleteValueFromSet" Deletes Value From Set', async () => {
    await inMemoryDatabaseImplementation.sAdd(
      USER_IN_MEMORY_DATABASE_KEY,
      USER_ID.toString(),
    );

    await inMemoryDatabase.deleteValueFromSet(
      USER_IN_MEMORY_DATABASE_KEY,
      USER_ID.toString(),
    );

    const allSetValues = await inMemoryDatabaseImplementation.sMembers(
      USER_IN_MEMORY_DATABASE_KEY,
    );

    expect(allSetValues.length).toEqual(0);
  });

  test('Test If Method "getHash" Returns Hash From In-Memory Database', async () => {
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

    const hash = await inMemoryDatabase.getHash(
      USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
    );

    expect(hash[0].key).toEqual(USER_ID_IN_MEMORY_DATABASE_KEY);
    expect(hash[0].value).toEqual(USER_ID.toString());

    expect(hash[1].key).toEqual(USER_USERNAME_IN_MEMORY_DATABASE_KEY);
    expect(hash[1].value).toEqual(USER_USERNAME);
  });

  test('Test If Method "addHash" Adds Hash To In-Memory Database', async () => {
    const userIdHashItem = HashItemEntityFactory.getInstance(
      USER_ID_IN_MEMORY_DATABASE_KEY,
      USER_ID.toString(),
    );
    const userUsernameHashItem = HashItemEntityFactory.getInstance(
      USER_USERNAME_IN_MEMORY_DATABASE_KEY,
      USER_USERNAME,
    );

    await inMemoryDatabase.addHash(USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID), [
      userIdHashItem,
      userUsernameHashItem,
    ]);

    const hashFieldsAndValues = await inMemoryDatabaseImplementation.hGetAll(
      USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
    );

    expect(hashFieldsAndValues[USER_ID_IN_MEMORY_DATABASE_KEY]).toEqual(
      USER_ID.toString(),
    );
    expect(hashFieldsAndValues[USER_USERNAME_IN_MEMORY_DATABASE_KEY]).toEqual(
      USER_USERNAME,
    );
  });

  test('Test If Method "updateHash" Updates Hash On In-Memory Database', async () => {
    await inMemoryDatabaseImplementation.hSet(
      USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
      USER_ID_IN_MEMORY_DATABASE_KEY,
      "",
    );

    await inMemoryDatabaseImplementation.hSet(
      USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
      USER_USERNAME_IN_MEMORY_DATABASE_KEY,
      "",
    );

    const initialHashFieldsAndValues =
      await inMemoryDatabaseImplementation.hGetAll(
        USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
      );

    expect(initialHashFieldsAndValues[USER_ID_IN_MEMORY_DATABASE_KEY]).toEqual(
      "",
    );
    expect(
      initialHashFieldsAndValues[USER_USERNAME_IN_MEMORY_DATABASE_KEY],
    ).toEqual("");

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

    const hashFieldsAndValues = await inMemoryDatabaseImplementation.hGetAll(
      USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
    );

    expect(hashFieldsAndValues[USER_ID_IN_MEMORY_DATABASE_KEY]).toEqual(
      USER_ID.toString(),
    );
    expect(hashFieldsAndValues[USER_USERNAME_IN_MEMORY_DATABASE_KEY]).toEqual(
      USER_USERNAME,
    );
  });

  test("Test If Method deleteHash Deletes Hash On In-Memory Database", async () => {
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

    await inMemoryDatabase.deleteHash(
      USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
    );

    const hashFieldsAndValues = await inMemoryDatabaseImplementation.hGetAll(
      USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
    );

    expect(Object.keys(hashFieldsAndValues).length).toEqual(0);
  });
});

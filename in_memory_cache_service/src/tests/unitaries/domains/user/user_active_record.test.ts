import {
  describe,
  beforeAll,
  beforeEach,
  afterAll,
  test,
  expect,
} from "@jest/globals";
import UserActiveRecord from "../../../../domains/user/user_active_record";
import InMemoryDatabase from "../../../../domains/in_memory_database/in_memory_database";
import {
  IN_MEMORY_DATABASE_HOST_NAME,
  IN_MEMORY_DATABASE_HOST_PORT,
} from "../../../../constants/application_constants";
import {
  USER_HASH_IN_MEMORY_DATABASE_KEY,
  USER_ID,
  USER_ID_IN_MEMORY_DATABASE_KEY,
  USER_IN_MEMORY_DATABASE_KEY,
  USER_USERNAME,
  USER_USERNAME_IN_MEMORY_DATABASE_KEY,
} from "../../../../constants/domains/user_constants";
import InMemoryDatabaseFactory from "../../../../domains/in_memory_database/in_memory_database_factory";
import HashItemEntityFactory from "../../../../domains/in_memory_database/hash_item_entity_factory";
import UserEntityFactory from "../../../../domains/user/user_entity_factory";

describe("Test Class UserActiveRecord Behavior", () => {
  let userActiveRecord: UserActiveRecord;
  let inMemoryDatabase: InMemoryDatabase;

  beforeAll(async () => {
    inMemoryDatabase = await InMemoryDatabaseFactory.getInstance(
      IN_MEMORY_DATABASE_HOST_NAME,
      IN_MEMORY_DATABASE_HOST_PORT,
    );

    userActiveRecord = new UserActiveRecord(inMemoryDatabase);
  });

  beforeEach(async () => {
    try {
      await inMemoryDatabase.deleteValueFromSet(
        USER_IN_MEMORY_DATABASE_KEY,
        USER_ID.toString(),
      );

      await inMemoryDatabase.deleteHash(
        USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  afterAll(async () => {
    try {
      await inMemoryDatabase.deleteValueFromSet(
        USER_IN_MEMORY_DATABASE_KEY,
        USER_ID.toString(),
      );

      await inMemoryDatabase.deleteHash(
        USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  test('Test If Method "getAllUsersFromInMemoryDatabase" Returns All Users From In-Memory Database', async () => {
    const userIdHashItem = HashItemEntityFactory.getInstance(
      USER_ID_IN_MEMORY_DATABASE_KEY,
      USER_ID.toString(),
    );
    const userUsernameHashItem = HashItemEntityFactory.getInstance(
      USER_USERNAME_IN_MEMORY_DATABASE_KEY,
      USER_USERNAME,
    );

    await inMemoryDatabase.addValueToSet(
      USER_IN_MEMORY_DATABASE_KEY,
      USER_ID.toString(),
    );

    await inMemoryDatabase.addHash(USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID), [
      userIdHashItem,
      userUsernameHashItem,
    ]);

    const allUsersFromInMemoryDatabase =
      await userActiveRecord.getAllUsersFromInMemoryDatabase();

    expect(allUsersFromInMemoryDatabase[0].id).toEqual(USER_ID);
    expect(allUsersFromInMemoryDatabase[0].username).toEqual(USER_USERNAME);
  });

  test('Test If Method "getUserFromInMemoryDatabase" Returns User From In-Memory Database', async () => {
    const userIdHashItem = HashItemEntityFactory.getInstance(
      USER_ID_IN_MEMORY_DATABASE_KEY,
      USER_ID.toString(),
    );
    const userUsernameHashItem = HashItemEntityFactory.getInstance(
      USER_USERNAME_IN_MEMORY_DATABASE_KEY,
      USER_USERNAME,
    );

    await inMemoryDatabase.addValueToSet(
      USER_IN_MEMORY_DATABASE_KEY,
      USER_ID.toString(),
    );

    await inMemoryDatabase.addHash(USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID), [
      userIdHashItem,
      userUsernameHashItem,
    ]);

    const allUsersFromInMemoryDatabase =
      await userActiveRecord.getUserFromInMemoryDatabase(USER_ID);

    expect(allUsersFromInMemoryDatabase.id).toEqual(USER_ID);
    expect(allUsersFromInMemoryDatabase.username).toEqual(USER_USERNAME);
  });

  test('Test If Method "getUserFromInMemoryDatabase" Returns User From In-Memory Database', async () => {
    const userIdHashItem = HashItemEntityFactory.getInstance(
      USER_ID_IN_MEMORY_DATABASE_KEY,
      USER_ID.toString(),
    );
    const userUsernameHashItem = HashItemEntityFactory.getInstance(
      USER_USERNAME_IN_MEMORY_DATABASE_KEY,
      USER_USERNAME,
    );

    await inMemoryDatabase.addValueToSet(
      USER_IN_MEMORY_DATABASE_KEY,
      USER_ID.toString(),
    );

    await inMemoryDatabase.addHash(USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID), [
      userIdHashItem,
      userUsernameHashItem,
    ]);

    const allUsersFromInMemoryDatabase =
      await userActiveRecord.getUserFromInMemoryDatabase(USER_ID);

    expect(allUsersFromInMemoryDatabase.id).toEqual(USER_ID);
    expect(allUsersFromInMemoryDatabase.username).toEqual(USER_USERNAME);
  });

  test('Test If Method "createUserOnInMemoryDatabase" Creates User On In-Memory Database', async () => {
    const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    await userActiveRecord.createUserOnInMemoryDatabase(user);

    const retrievedUser = await inMemoryDatabase.getHash(
      USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID),
    );

    expect(retrievedUser[0].value).toEqual(USER_ID.toString());
    expect(retrievedUser[1].value).toEqual(USER_USERNAME);
  });

  test('Test If Method "updateUserOnInMemoryDatabase" Updates User On In-Memory Database', async () => {
    const userIdHashItem = HashItemEntityFactory.getInstance(
      USER_ID_IN_MEMORY_DATABASE_KEY,
      USER_ID.toString(),
    );
    const userUsernameHashItem = HashItemEntityFactory.getInstance(
      USER_USERNAME_IN_MEMORY_DATABASE_KEY,
      "",
    );

    await inMemoryDatabase.addValueToSet(
      USER_IN_MEMORY_DATABASE_KEY,
      USER_ID.toString(),
    );

    await inMemoryDatabase.addHash(USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID), [
      userIdHashItem,
      userUsernameHashItem,
    ]);

    const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    await userActiveRecord.updateUserOnInMemoryDatabase(user);

    const updatedUser =
      await userActiveRecord.getUserFromInMemoryDatabase(USER_ID);

    expect(updatedUser.id).toEqual(USER_ID);
    expect(updatedUser.username).toEqual(USER_USERNAME);
  });

  test('Test If Method "deleteUserOnInMemoryDatabase" Deletes User On In-Memory Database', async () => {
    const userIdHashItem = HashItemEntityFactory.getInstance(
      USER_ID_IN_MEMORY_DATABASE_KEY,
      USER_ID.toString(),
    );
    const userUsernameHashItem = HashItemEntityFactory.getInstance(
      USER_USERNAME_IN_MEMORY_DATABASE_KEY,
      "",
    );

    await inMemoryDatabase.addValueToSet(
      USER_IN_MEMORY_DATABASE_KEY,
      USER_ID.toString(),
    );

    await inMemoryDatabase.addHash(USER_HASH_IN_MEMORY_DATABASE_KEY(USER_ID), [
      userIdHashItem,
      userUsernameHashItem,
    ]);

    await userActiveRecord.deleteUserOnInMemoryDatabase(USER_ID);

    const listOfUsersId = await inMemoryDatabase.getAllSetValues(
      USER_IN_MEMORY_DATABASE_KEY,
    );

    expect(listOfUsersId.length).toEqual(0);
  });
});

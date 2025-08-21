import {
  describe,
  beforeAll,
  beforeEach,
  afterAll,
  test,
  expect,
} from "@jest/globals";
import InMemoryDatabaseFactory from "../../domains/in_memory_database/in_memory_database_factory";
import {
  IN_MEMORY_DATABASE_HOST_NAME,
  IN_MEMORY_DATABASE_HOST_PORT,
} from "../../constants/application_constants";
import UserActiveRecordDecorator from "../../domains/user/user_active_record_decorator";
import UserActiveRecord from "../../domains/user/user_active_record";
import {
  NOT_EXISTING_USER_ERROR_MESSAGE,
  NOT_EXISTING_USER_ERROR_NAME,
  USER_ID,
  USER_USERNAME,
} from "../../constants/domains/user_constants";
import UserEntityFactory from "../../domains/user/user_entity_factory";
import UserRepository from "../../domains/user/user_repository";

describe("Test Component User Behavior", () => {
  let userRepository: UserRepository;
  let userActiveRecord: UserActiveRecord;

  beforeAll(async () => {
    const inMemoryDatabase = await InMemoryDatabaseFactory.getInstance(
      IN_MEMORY_DATABASE_HOST_NAME,
      IN_MEMORY_DATABASE_HOST_PORT,
    );

    userActiveRecord = new UserActiveRecordDecorator(inMemoryDatabase);

    userRepository = new UserRepository(userActiveRecord);
  });

  beforeEach(async () => {
    try {
      await userActiveRecord.deleteUserOnInMemoryDatabase(USER_ID);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  afterAll(async () => {
    try {
      await userActiveRecord.deleteUserOnInMemoryDatabase(USER_ID);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  test('Test Fetching All Users From Database', async () => {
    const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    await userActiveRecord.createUserOnInMemoryDatabase(user);

    const listOfUsers = await userRepository.getUsers();

    expect(listOfUsers[0].id).toEqual(USER_ID);
    expect(listOfUsers[0].username).toEqual(USER_USERNAME);
  });

  test('Test Fetching User From Database', async () => {
    const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    await userActiveRecord.createUserOnInMemoryDatabase(user);

    const retrievedUser = await userRepository.getUser(USER_ID);

    expect(retrievedUser.id).toEqual(USER_ID);
    expect(retrievedUser.username).toEqual(USER_USERNAME);
  });

  test('Test Creating User On Database', async () => {
    const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    await userRepository.createUser(user);

    const retrievedUser =
      await userActiveRecord.getUserFromInMemoryDatabase(USER_ID);

    expect(retrievedUser.id).toEqual(USER_ID);
    expect(retrievedUser.username).toEqual(USER_USERNAME);
  });

  test('Test Updating User On Database', async () => {
    const user = UserEntityFactory.getInstance(USER_ID, "");

    await userActiveRecord.createUserOnInMemoryDatabase(user);

    const updatedUser = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    await userRepository.updateUser(updatedUser);

    const retrievedUser =
      await userActiveRecord.getUserFromInMemoryDatabase(USER_ID);

    expect(retrievedUser.id).toEqual(USER_ID);
    expect(retrievedUser.username).toEqual(USER_USERNAME);
  });

  test('Test Deleting User On Database', async () => {
    try {
      const user = UserEntityFactory.getInstance(USER_ID, "");

      await userActiveRecord.createUserOnInMemoryDatabase(user);

      await userRepository.deleteUser(USER_ID);

      await userActiveRecord.getUserFromInMemoryDatabase(USER_ID);
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_USER_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_USER_ERROR_MESSAGE);
    }
  });
});

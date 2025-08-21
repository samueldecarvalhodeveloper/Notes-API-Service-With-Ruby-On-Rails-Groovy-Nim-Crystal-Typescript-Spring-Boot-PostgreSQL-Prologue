import {
  describe,
  beforeAll,
  beforeEach,
  afterAll,
  test,
  expect,
} from "@jest/globals";
import {
  NOT_EXISTING_USER_ERROR_MESSAGE,
  NOT_EXISTING_USER_ERROR_NAME,
  USER_ID,
  USER_USERNAME,
} from "../../constants/domains/user_constants";
import UserRepository from "../../domains/user/user_repository";
import UserRepositoryFactory from "../../domains/user/user_repository_factory";
import UserEntityFactory from "../../domains/user/user_entity_factory";

describe('Test If Integration Of "User Using In-Memory Database" Behavior', () => {
  let userRepository: UserRepository;

  beforeAll(async () => {
    userRepository = await UserRepositoryFactory.getInstance();
  });

  beforeEach(async () => {
    try {
      await userRepository.deleteUser(USER_ID);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  afterAll(async () => {
    try {
      await userRepository.deleteUser(USER_ID);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  test("Test If User Handles Its On Operations On In-Memory Database", async () => {
    const user = UserEntityFactory.getInstance(USER_ID, "");

    await userRepository.createUser(user);

    const retrievedUser = await userRepository.getUser(USER_ID);

    expect(retrievedUser.id).toEqual(USER_ID);
    expect(retrievedUser.username).toEqual("");

    const updatedUser = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    await userRepository.updateUser(updatedUser);

    const userWithUpdatedData = (await userRepository.getUsers())[0];

    expect(userWithUpdatedData.id).toEqual(USER_ID);
    expect(userWithUpdatedData.username).toEqual(USER_USERNAME);

    await userRepository.deleteUser(USER_ID);

    try {
      await userRepository.getUser(USER_ID);
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_USER_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_USER_ERROR_MESSAGE);
    }
  });
});

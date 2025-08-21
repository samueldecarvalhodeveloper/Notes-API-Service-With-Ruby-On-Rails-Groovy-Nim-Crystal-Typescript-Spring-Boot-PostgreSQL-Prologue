import { describe, test, expect } from "@jest/globals";
import UserRepositoryFactory from "../../../../domains/user/user_repository_factory";

describe("Test Class UserRepositoryFactory Behavior", () => {
  test('Test If Method "getInstance" Returns A Working Instance', async () => {
    const userRepository = await UserRepositoryFactory.getInstance();

    const listOfUsers = await userRepository.getUsers();

    expect(listOfUsers.length).toEqual(0);
  });
});

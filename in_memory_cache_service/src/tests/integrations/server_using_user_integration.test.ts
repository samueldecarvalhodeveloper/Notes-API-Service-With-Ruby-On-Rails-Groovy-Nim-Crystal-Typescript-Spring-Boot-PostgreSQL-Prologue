import { describe, beforeAll, afterAll, test, expect } from "@jest/globals";
import request from "supertest";
import UserRepository from "../../domains/user/user_repository";
import UserRepositoryFactory from "../../domains/user/user_repository_factory";
import UserEntityFactory from "../../domains/user/user_entity_factory";
import {
  NOT_EXISTING_USER_ERROR_MESSAGE,
  NOT_EXISTING_USER_ERROR_NAME,
  USER_ID,
  USER_USERNAME,
} from "../../constants/domains/user_constants";
import { USERS_INDEX_ROUTE } from "../../constants/routes_constants";
import { StatusCodes } from "http-status-codes";
import { app } from "../../server/server";

describe('Test If Integration Of "Server Using User" Behavior', () => {
  let userRepository: UserRepository;

  beforeAll(async () => {
    userRepository = await UserRepositoryFactory.getInstance();

    try {
      const user = UserEntityFactory.getInstance(USER_ID, "");

      await userRepository.createUser(user);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  afterAll(async () => {
    try {
      await userRepository.deleteUser(USER_ID);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}
  });

  test("Test If Server Can Use User", async () => {
    const requestOnApp = request(app);

    const getAllUsersResponse = await requestOnApp.get(USERS_INDEX_ROUTE);

    expect(getAllUsersResponse.status).toEqual(StatusCodes.OK);
    expect(getAllUsersResponse.body[0].id).toEqual(USER_ID);
    expect(getAllUsersResponse.body[0].username).toEqual("");

    const getUserResponse = await requestOnApp.get(
      `${USERS_INDEX_ROUTE}${USER_ID}/`,
    );

    expect(getUserResponse.status).toEqual(StatusCodes.OK);
    expect(getUserResponse.body.id).toEqual(USER_ID);
    expect(getUserResponse.body.username).toEqual("");

    const user = UserEntityFactory.getInstance(USER_ID, "");

    const createUserResponse = await requestOnApp
      .post(`${USERS_INDEX_ROUTE}`)
      .send(user);

    expect(createUserResponse.status).toEqual(StatusCodes.CONFLICT);

    const updatedUser = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    const updateUserResponse = await requestOnApp
      .patch(`${USERS_INDEX_ROUTE}${USER_ID}/`)
      .send(updatedUser);

    expect(updateUserResponse.status).toEqual(StatusCodes.OK);

    const updateUserOnInMemoryDatabase = await userRepository.getUser(USER_ID);

    expect(updateUserOnInMemoryDatabase.id).toEqual(USER_ID);
    expect(updateUserOnInMemoryDatabase.username).toEqual(USER_USERNAME);

    const deleteUserResponse = await requestOnApp.delete(
      `${USERS_INDEX_ROUTE}${USER_ID}/`,
    );

    expect(deleteUserResponse.status).toEqual(StatusCodes.NO_CONTENT);

    try {
      await userRepository.getUser(USER_ID);
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_USER_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_USER_ERROR_MESSAGE);
    }
  });
});

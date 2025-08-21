import {
  describe,
  beforeAll,
  beforeEach,
  afterAll,
  test,
  expect,
} from "@jest/globals";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../../server/server";
import { USERS_INDEX_ROUTE } from "../../../constants/routes_constants";
import {
  NOT_EXISTING_USER_ERROR_MESSAGE,
  NOT_EXISTING_USER_ERROR_NAME,
  USER_ID,
  USER_USERNAME,
} from "../../../constants/domains/user_constants";
import UserRepository from "../../../domains/user/user_repository";
import UserRepositoryFactory from "../../../domains/user/user_repository_factory";
import UserEntityFactory from "../../../domains/user/user_entity_factory";
import TestAgent from "supertest/lib/agent";

describe("Test Class UserController Behavior", () => {
  let userRepository: UserRepository;
  let requestOnApp: TestAgent;

  beforeAll(async () => {
    userRepository = await UserRepositoryFactory.getInstance();

    requestOnApp = request(app);
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

  test('Test If Method "getAllUsers" Responds All Users', async () => {
    const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    await userRepository.createUser(user);

    const response = await requestOnApp.get(USERS_INDEX_ROUTE);

    expect(response.status).toEqual(StatusCodes.OK);
    expect(response.body[0].id).toEqual(USER_ID);
    expect(response.body[0].username).toEqual(USER_USERNAME);
  });

  test('Test If Method "getUser" Responds User', async () => {
    const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    await userRepository.createUser(user);

    const response = await requestOnApp.get(`${USERS_INDEX_ROUTE}${USER_ID}/`);

    expect(response.status).toEqual(StatusCodes.OK);
    expect(response.body.id).toEqual(USER_ID);
    expect(response.body.username).toEqual(USER_USERNAME);
  });

  test('Test If Method "getUser" Responds Not Found If User Does Not Exist', async () => {
    const response = await requestOnApp.get(`${USERS_INDEX_ROUTE}${USER_ID}/`);

    expect(response.status).toEqual(StatusCodes.NOT_FOUND);
  });

  test('Test If Method "createUser" Creates User On In-Memory Database', async () => {
    const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    const response = await requestOnApp.post(`${USERS_INDEX_ROUTE}`).send(user);

    const retrievedUser = await userRepository.getUser(USER_ID);

    expect(response.status).toEqual(StatusCodes.CREATED);
    expect(retrievedUser.id).toEqual(USER_ID);
    expect(retrievedUser.username).toEqual(USER_USERNAME);
  });

  test('Test If Method "createUser" Conflict Not Found If User Does Not Exist', async () => {
    const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    await userRepository.createUser(user);

    const response = await requestOnApp.post(`${USERS_INDEX_ROUTE}`).send(user);

    expect(response.status).toEqual(StatusCodes.CONFLICT);
  });

  test('Test If Method "updateUser" Updates User On In-Memory Database', async () => {
    const user = UserEntityFactory.getInstance(USER_ID, "");

    await userRepository.createUser(user);

    const updatedUser = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    const response = await requestOnApp
      .patch(`${USERS_INDEX_ROUTE}${USER_ID}`)
      .send(updatedUser);

    const retrievedUser = await userRepository.getUser(USER_ID);

    expect(response.status).toEqual(StatusCodes.OK);
    expect(retrievedUser.id).toEqual(USER_ID);
    expect(retrievedUser.username).toEqual(USER_USERNAME);
  });

  test('Test If Method "updateUser" Responds Not Found If User Does Not Exist', async () => {
    const response = await requestOnApp.patch(`${USERS_INDEX_ROUTE}${USER_ID}`);

    expect(response.status).toEqual(StatusCodes.NOT_FOUND);
  });

  test('Test If Method "deleteUser" Deletes User On In-Memory Database', async () => {
    const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    await userRepository.createUser(user);

    const response = await requestOnApp.delete(
      `${USERS_INDEX_ROUTE}${USER_ID}`,
    );

    expect(response.status).toEqual(StatusCodes.NO_CONTENT);

    try {
      await userRepository.getUser(USER_ID);
    } catch (error) {
      const castedError = error as Error;

      expect(castedError.name).toEqual(NOT_EXISTING_USER_ERROR_NAME);
      expect(castedError.message).toEqual(NOT_EXISTING_USER_ERROR_MESSAGE);
    }
  });

  test('Test If Method "deleteUser" Responds Not Found If User Does Not Exist', async () => {
    const response = await requestOnApp.delete(
      `${USERS_INDEX_ROUTE}${USER_ID}`,
    );

    expect(response.status).toEqual(StatusCodes.NOT_FOUND);
  });
});

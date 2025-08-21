import { Request, Response } from "express";
import UserRepositoryFactory from "../domains/user/user_repository_factory";
import { StatusCodes } from "http-status-codes";
import UserEntityFactory from "../domains/user/user_entity_factory";

class UserController {
  public static async getAllUsers(
    request: Request,
    response: Response,
  ): Promise<void> {
    const userRepository = await UserRepositoryFactory.getInstance();

    const users = await userRepository.getUsers();

    response.json(users);
  }

  public static async getUser(
    request: Request,
    response: Response,
  ): Promise<void> {
    try {
      const userId = Number(request.params.id);

      const userRepository = await UserRepositoryFactory.getInstance();

      const users = await userRepository.getUser(userId);

      response.json(users);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      response.status(StatusCodes.NOT_FOUND).send("");
    }
  }

  public static async createUser(
    request: Request,
    response: Response,
  ): Promise<void> {
    try {
      const userId = Number(request.body.id);
      const userUsername = request.body.username;

      const userRepository = await UserRepositoryFactory.getInstance();

      const user = UserEntityFactory.getInstance(userId, userUsername);

      await userRepository.createUser(user);

      response.status(StatusCodes.CREATED).send("");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      response.status(StatusCodes.CONFLICT).send("");
    }
  }

  public static async updateUser(
    request: Request,
    response: Response,
  ): Promise<void> {
    try {
      const userId = Number(request.body.id);
      const userUsername = request.body.username;

      const userRepository = await UserRepositoryFactory.getInstance();

      const user = UserEntityFactory.getInstance(userId, userUsername);

      await userRepository.updateUser(user);

      response.status(StatusCodes.OK).send("");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      response.status(StatusCodes.NOT_FOUND).send("");
    }
  }

  public static async deleteUser(
    request: Request,
    response: Response,
  ): Promise<void> {
    try {
      const userId = Number(request.params.id);

      const userRepository = await UserRepositoryFactory.getInstance();

      await userRepository.deleteUser(userId);

      response.status(StatusCodes.NO_CONTENT).send("");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      response.status(StatusCodes.NOT_FOUND).send("");
    }
  }
}

export default UserController;

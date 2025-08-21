import { describe, beforeAll, afterAll, test, expect } from "@jest/globals";
import {
  USER_ID,
  USER_USERNAME,
} from "../../../../constants/domains/user_constants";
import UserRepositoryFactory from "../../../../domains/user/user_repository_factory";
import UserEntityFactory from "../../../../domains/user/user_entity_factory";
import UserRepository from "../../../../domains/user/user_repository";
import NoteRepositoryFactory from "../../../../domains/note/note_repository_factory";

describe("Test Class NoteRepositoryFactory Behavior", () => {
  let userRepository: UserRepository;

  beforeAll(async () => {
    userRepository = await UserRepositoryFactory.getInstance();

    try {
      const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

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

  test('Test If Method "getInstance" Returns A Working Instance', async () => {
    const noteRepository = await NoteRepositoryFactory.getInstance();

    const userNotes = await noteRepository.getNotes(USER_ID);

    expect(userNotes.length).toEqual(0);
  });
});

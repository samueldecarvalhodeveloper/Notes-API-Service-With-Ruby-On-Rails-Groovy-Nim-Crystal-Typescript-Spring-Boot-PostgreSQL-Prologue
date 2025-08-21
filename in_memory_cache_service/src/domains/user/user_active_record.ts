import {
  USER_HASH_IN_MEMORY_DATABASE_KEY,
  USER_USERNAME_IN_MEMORY_DATABASE_KEY,
  USER_IN_MEMORY_DATABASE_KEY,
  USER_ID_IN_MEMORY_DATABASE_KEY,
} from "../../constants/domains/user_constants";
import HashItemEntityFactory from "../in_memory_database/hash_item_entity_factory";
import InMemoryDatabase from "../in_memory_database/in_memory_database";
import UserEntity from "./infrastructure/entities/user_entity";
import AlreadyExistingUserError from "./infrastructure/errors/already_existing_user_error";
import NotExistingUserError from "./infrastructure/errors/not_existing_user_error";
import UserEntityFactory from "./user_entity_factory";

class UserActiveRecord {
  private inMemoryDatabase: InMemoryDatabase;

  public constructor(inMemoryDatabase: InMemoryDatabase) {
    this.inMemoryDatabase = inMemoryDatabase;
  }

  public async getAllUsersFromInMemoryDatabase(): Promise<Array<UserEntity>> {
    const listOfUsers: Array<UserEntity> = [];

    const listOfUsersIdFromInMemoryDatabase =
      await this.inMemoryDatabase.getAllSetValues(USER_IN_MEMORY_DATABASE_KEY);

    for (const userId of listOfUsersIdFromInMemoryDatabase) {
      const retrievedHashOfUserFromInMemoryDatabase =
        await this.inMemoryDatabase.getHash(
          USER_HASH_IN_MEMORY_DATABASE_KEY(Number(userId)),
        );

      const user = UserEntityFactory.getInstance(
        Number(retrievedHashOfUserFromInMemoryDatabase[0].value),
        retrievedHashOfUserFromInMemoryDatabase[1].value,
      );

      listOfUsers.push(user);
    }

    return listOfUsers;
  }

  public async getUserFromInMemoryDatabase(id: number): Promise<UserEntity> {
    try {
      const retrievedHashOfUserFromInMemoryDatabase =
        await this.inMemoryDatabase.getHash(
          USER_HASH_IN_MEMORY_DATABASE_KEY(id),
        );

      const user = UserEntityFactory.getInstance(
        Number(retrievedHashOfUserFromInMemoryDatabase[0].value),
        retrievedHashOfUserFromInMemoryDatabase[1].value,
      );

      return user;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new NotExistingUserError();
    }
  }

  public async createUserOnInMemoryDatabase(user: UserEntity): Promise<void> {
    try {
      await this.inMemoryDatabase.addHash(
        USER_HASH_IN_MEMORY_DATABASE_KEY(user.id),
        [
          HashItemEntityFactory.getInstance(
            USER_ID_IN_MEMORY_DATABASE_KEY,
            user.id.toString(),
          ),
          HashItemEntityFactory.getInstance(
            USER_USERNAME_IN_MEMORY_DATABASE_KEY,
            user.username.toString(),
          ),
        ],
      );

      await this.inMemoryDatabase.addValueToSet(
        USER_IN_MEMORY_DATABASE_KEY,
        user.id.toString(),
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new AlreadyExistingUserError();
    }
  }

  public async updateUserOnInMemoryDatabase(user: UserEntity): Promise<void> {
    try {
      await this.inMemoryDatabase.updateHash(
        USER_HASH_IN_MEMORY_DATABASE_KEY(user.id),
        [
          HashItemEntityFactory.getInstance(
            USER_ID_IN_MEMORY_DATABASE_KEY,
            user.id.toString(),
          ),
          HashItemEntityFactory.getInstance(
            USER_USERNAME_IN_MEMORY_DATABASE_KEY,
            user.username,
          ),
        ],
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new NotExistingUserError();
    }
  }

  public async deleteUserOnInMemoryDatabase(id: number): Promise<void> {
    try {
      await this.inMemoryDatabase.deleteValueFromSet(
        USER_IN_MEMORY_DATABASE_KEY,
        id.toString(),
      );

      await this.inMemoryDatabase.deleteHash(
        USER_HASH_IN_MEMORY_DATABASE_KEY(id),
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new NotExistingUserError();
    }
  }
}

export default UserActiveRecord;

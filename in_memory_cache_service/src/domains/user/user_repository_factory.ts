import {
  IN_MEMORY_DATABASE_HOST_NAME,
  IN_MEMORY_DATABASE_HOST_PORT,
} from "../../constants/application_constants";
import InMemoryDatabaseFactory from "../in_memory_database/in_memory_database_factory";
import UserActiveRecordDecorator from "./user_active_record_decorator";
import UserRepository from "./user_repository";

class UserRepositoryFactory {
  private static instance: UserRepository | null = null;

  private constructor() {}

  public static async getInstance(): Promise<UserRepository> {
    if (this.instance === null) {
      const inMemoryDatabase = await InMemoryDatabaseFactory.getInstance(
        IN_MEMORY_DATABASE_HOST_NAME,
        IN_MEMORY_DATABASE_HOST_PORT,
      );

      const userActiveRecord = new UserActiveRecordDecorator(inMemoryDatabase);

      this.instance = new UserRepository(userActiveRecord);
    }

    return this.instance;
  }
}

export default UserRepositoryFactory;

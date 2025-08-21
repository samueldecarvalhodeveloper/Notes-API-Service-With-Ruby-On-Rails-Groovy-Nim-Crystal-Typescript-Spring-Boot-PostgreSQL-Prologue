import { RedisClientType } from "redis";
import AlreadyExistingHashError from "./infrastructure/errors/already_existing_hash_error";
import NotExistingHashError from "./infrastructure/errors/not_existing_hash_error";
import { isHashOnDatabase } from "./infrastructure/specifications/in_memory_database_specifications";

class HashValidator {
  private constructor() {}

  public static async throwAnAlreadyExistingHashErrorIfHashIsAlreadyOnDatabase(
    hashName: string,
    InMemoryDatabase: RedisClientType<any>,
  ): Promise<void> {
    const hashFieldsAndValues = await InMemoryDatabase.hGetAll(hashName);

    if (isHashOnDatabase(hashFieldsAndValues)) {
      throw new AlreadyExistingHashError();
    }
  }

  public static async throwANotExistingHashErrorIfHashIsNotOnDatabase(
    hashName: string,
    InMemoryDatabase: RedisClientType<any>,
  ): Promise<void> {
    const hashFieldsAndValues = await InMemoryDatabase.hGetAll(hashName);

    if (!isHashOnDatabase(hashFieldsAndValues)) {
      throw new NotExistingHashError();
    }
  }
}

export default HashValidator;

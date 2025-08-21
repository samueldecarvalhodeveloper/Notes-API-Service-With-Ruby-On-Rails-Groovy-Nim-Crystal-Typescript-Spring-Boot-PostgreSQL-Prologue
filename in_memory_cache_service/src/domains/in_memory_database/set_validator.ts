import { RedisClientType } from "redis";
import NotExistingValueError from "./infrastructure/errors/not_existing_value_error";
import AlreadyExistingValueError from "./infrastructure/errors/already_existing_value_error";

class SetValidator {
  private constructor() {}

  public static async throwNotExistingValueErrorIfValueIsNotOnSetFromDatabase(
    setName: string,
    value: string,
    inMemoryDatabase: RedisClientType<any>,
  ): Promise<void> {
    const isValueNotOnSet = !(await inMemoryDatabase.sIsMember(setName, value));

    if (isValueNotOnSet) {
      throw new NotExistingValueError();
    }
  }

  public static async throwAlreadyExistingValueErrorIfValueIsAlreadyOnSetFromDatabase(
    setName: string,
    value: string,
    inMemoryDatabase: RedisClientType<any>,
  ): Promise<void> {
    const isValueOnSet = await inMemoryDatabase.sIsMember(setName, value);

    if (isValueOnSet) {
      throw new AlreadyExistingValueError();
    }
  }
}

export default SetValidator;

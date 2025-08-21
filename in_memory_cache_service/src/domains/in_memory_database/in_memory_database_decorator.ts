import { RedisClientType } from "redis";
import HashItemEntity from "./infrastructure/entities/hash_item_entity";
import InMemoryDatabase from "./in_memory_database";
import HashValidator from "./hash_validator";
import SetValidator from "./set_validator";

class InMemoryDatabaseDecorator extends InMemoryDatabase {
  private decoratorInMemoryDatabase: RedisClientType<any>;

  public constructor(inMemoryDatabase: RedisClientType<any>) {
    super(inMemoryDatabase);

    this.decoratorInMemoryDatabase = inMemoryDatabase;
  }

  public async addValueToSet(setName: string, value: string): Promise<void> {
    await SetValidator.throwAlreadyExistingValueErrorIfValueIsAlreadyOnSetFromDatabase(
      setName,
      value,
      this.decoratorInMemoryDatabase,
    );

    super.addValueToSet(setName, value);
  }

  public async deleteValueFromSet(
    setName: string,
    value: string,
  ): Promise<void> {
    await SetValidator.throwNotExistingValueErrorIfValueIsNotOnSetFromDatabase(
      setName,
      value,
      this.decoratorInMemoryDatabase,
    );

    await super.deleteValueFromSet(setName, value);
  }

  public async getHash(hashName: string): Promise<Array<HashItemEntity>> {
    await HashValidator.throwANotExistingHashErrorIfHashIsNotOnDatabase(
      hashName,
      this.decoratorInMemoryDatabase,
    );

    return super.getHash(hashName);
  }

  public async addHash(
    hashName: string,
    listOfHashItems: Array<HashItemEntity>,
  ): Promise<void> {
    await HashValidator.throwAnAlreadyExistingHashErrorIfHashIsAlreadyOnDatabase(
      hashName,
      this.decoratorInMemoryDatabase,
    );

    await super.addHash(hashName, listOfHashItems);
  }

  public async updateHash(
    hashName: string,
    newHashItemToBeUpdated: Array<HashItemEntity>,
  ) {
    await HashValidator.throwANotExistingHashErrorIfHashIsNotOnDatabase(
      hashName,
      this.decoratorInMemoryDatabase,
    );

    await super.deleteHash(hashName);

    await super.updateHash(hashName, newHashItemToBeUpdated);
  }

  public async deleteHash(hashName: string): Promise<void> {
    await HashValidator.throwANotExistingHashErrorIfHashIsNotOnDatabase(
      hashName,
      this.decoratorInMemoryDatabase,
    );

    await super.deleteHash(hashName);
  }
}

export default InMemoryDatabaseDecorator;

import { RedisClientType } from "redis";
import HashItemEntity from "./infrastructure/entities/hash_item_entity";
import HashItemEntityFactory from "./hash_item_entity_factory";

class InMemoryDatabase {
  private inMemoryDatabaseImplementation: RedisClientType<any>;

  public constructor(inMemoryDatabaseImplementation: RedisClientType<any>) {
    this.inMemoryDatabaseImplementation = inMemoryDatabaseImplementation;
  }

  public getAllSetValues(setName: string): Promise<Array<string>> {
    return this.inMemoryDatabaseImplementation.sMembers(setName);
  }

  public async addValueToSet(setName: string, value: string): Promise<void> {
    await this.inMemoryDatabaseImplementation.sAdd(setName, value);
  }

  public async deleteValueFromSet(
    setName: string,
    value: string,
  ): Promise<void> {
    await this.inMemoryDatabaseImplementation.sRem(setName, value);
  }

  public async getHash(hashName: string): Promise<Array<HashItemEntity>> {
    const listOfHashItems: Array<HashItemEntity> = [];

    const hashFieldsAndValues =
      await this.inMemoryDatabaseImplementation.hGetAll(hashName);

    for (const hashKey in hashFieldsAndValues) {
      const hashItem = HashItemEntityFactory.getInstance(
        hashKey,
        hashFieldsAndValues[hashKey],
      );

      listOfHashItems.push(hashItem);
    }

    return listOfHashItems;
  }

  public async addHash(
    hashName: string,
    listOfHashItems: Array<HashItemEntity>,
  ): Promise<void> {
    for (const hashItems of listOfHashItems) {
      await this.inMemoryDatabaseImplementation.hSet(
        hashName,
        hashItems.key,
        hashItems.value,
      );
    }
  }

  public async updateHash(
    hashName: string,
    newHashItemToBeUpdated: Array<HashItemEntity>,
  ) {
    for (const hashItem of newHashItemToBeUpdated) {
      await this.inMemoryDatabaseImplementation.hSet(
        hashName,
        hashItem.key,
        hashItem.value,
      );
    }
  }

  public async deleteHash(hashName: string): Promise<void> {
    await this.inMemoryDatabaseImplementation.del(hashName);
  }
}

export default InMemoryDatabase;

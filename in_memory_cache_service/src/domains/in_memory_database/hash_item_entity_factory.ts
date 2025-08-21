import HashItemEntity from "./infrastructure/entities/hash_item_entity";

class HashItemEntityFactory {
  private constructor() {}

  public static getInstance(key: string, value: string): HashItemEntity {
    return new HashItemEntity(key, value);
  }
}

export default HashItemEntityFactory;

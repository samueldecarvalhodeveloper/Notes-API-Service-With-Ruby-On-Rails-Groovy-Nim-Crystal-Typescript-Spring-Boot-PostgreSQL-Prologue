import { describe, test, expect } from "@jest/globals";
import {
  USER_ID,
  USER_ID_IN_MEMORY_DATABASE_KEY,
} from "../../../../constants/domains/user_constants";
import HashItemEntityFactory from "../../../../domains/in_memory_database/hash_item_entity_factory";

describe("Test Class HashItemEntityFactory Behavior", () => {
  test('Test If Method "getInstance" Returns A Working Instance', () => {
    const hashItem = HashItemEntityFactory.getInstance(
      USER_ID_IN_MEMORY_DATABASE_KEY,
      USER_ID.toString(),
    );

    expect(hashItem.key).toEqual(USER_ID_IN_MEMORY_DATABASE_KEY);
    expect(hashItem.value).toEqual(USER_ID.toString());
  });
});

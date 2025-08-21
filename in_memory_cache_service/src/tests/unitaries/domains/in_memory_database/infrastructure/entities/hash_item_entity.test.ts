import { describe, test, expect } from "@jest/globals";
import {
  USER_ID,
  USER_ID_IN_MEMORY_DATABASE_KEY,
} from "../../../../../../constants/domains/user_constants";
import HashItemEntity from "../../../../../../domains/in_memory_database/infrastructure/entities/hash_item_entity";

describe("Test Class HashItemEntity Behavior", () => {
  test("Test If Entity Describes How Hash Item Entity Should Be Used Be The System", () => {
    const hashItemEntity = new HashItemEntity(
      USER_ID_IN_MEMORY_DATABASE_KEY,
      USER_ID.toString(),
    );

    expect(hashItemEntity.key).toEqual(USER_ID_IN_MEMORY_DATABASE_KEY);
    expect(hashItemEntity.value).toEqual(USER_ID.toString());
  });
});

import { describe, test, expect } from "@jest/globals";
import { isHashOnDatabase } from "../../../../../../domains/in_memory_database/infrastructure/specifications/in_memory_database_specifications";
import {
  USER_ID,
  USER_USERNAME,
} from "../../../../../../constants/domains/user_constants";

describe("Test Module InMemoryDatabaseSpecifications Behavior", () => {
  test('Test If Method "isHashOnDatabase" Returns True If Hash Is Stored On Database', () => {
    const hashIsOnDatabase = isHashOnDatabase({
      "id key": USER_ID.toString(),
      "username key": USER_USERNAME,
    });
    const hashIsNotOnDatabase = isHashOnDatabase({});

    expect(hashIsOnDatabase).toBeTruthy();
    expect(hashIsNotOnDatabase).toBeFalsy();
  });
});

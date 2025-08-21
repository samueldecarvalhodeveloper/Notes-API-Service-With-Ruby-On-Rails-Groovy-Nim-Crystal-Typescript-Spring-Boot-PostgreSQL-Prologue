import { describe, test, expect } from "@jest/globals";
import UserEntity from "../../../../../../domains/user/infrastructure/entities/user_entity";
import {
  USER_ID,
  USER_USERNAME,
} from "../../../../../../constants/domains/user_constants";

describe("Test Class UserEntity Behavior", () => {
  test("Test If Entity Describes How User Should Be Used Be The System", () => {
    const user = new UserEntity(USER_ID, USER_USERNAME);

    expect(user.id).toEqual(USER_ID);
    expect(user.username).toEqual(USER_USERNAME);
  });
});

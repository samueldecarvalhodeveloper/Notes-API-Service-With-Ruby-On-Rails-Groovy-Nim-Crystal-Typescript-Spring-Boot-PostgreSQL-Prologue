import { describe, test, expect } from "@jest/globals";
import UserEntityFactory from "../../../../domains/user/user_entity_factory";
import {
  USER_ID,
  USER_USERNAME,
} from "../../../../constants/domains/user_constants";

describe("Test Class UserEntityFactory Behavior", () => {
  test('Test If Method "getInstance" Returns A Working Instance', () => {
    const user = UserEntityFactory.getInstance(USER_ID, USER_USERNAME);

    expect(user.id).toEqual(USER_ID);
    expect(user.username).toEqual(USER_USERNAME);
  });
});

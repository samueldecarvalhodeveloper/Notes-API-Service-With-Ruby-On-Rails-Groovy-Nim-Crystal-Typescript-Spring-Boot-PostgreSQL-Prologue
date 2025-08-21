import unittest2
from ../../../../../../src/domains/user/infrastructure/entities/user_entity import UserEntity
from ../../../../../../src/constants/domains/user_constants import USER_ID, USER_USERNAME

suite "Test Module \"User Entity\" Behavior":
  test "Test If Entity Describes How User Is Used By The System":
    let user = UserEntity(id: USER_ID, username: USER_USERNAME)

    check(user.id == USER_ID)
    check(user.username == USER_USERNAME)

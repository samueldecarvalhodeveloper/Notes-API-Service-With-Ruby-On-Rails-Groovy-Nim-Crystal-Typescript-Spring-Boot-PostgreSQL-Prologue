import unittest2
import json
from ../../../../src/domains/user/user_serializer import
  getSerializedListOfUsers,
  getSerializedUser
from ../../../../src/constants/domains/user_constants import
  USER_JSON,
  LIST_OF_USERS_JSON,
  USER_DATA_TRANSFER_OBJECT_JSON,
  LIST_USER_DATA_TRANSFER_OBJECT_JSON

suite "Test Module \"User Serializer\" Behavior":
  test "Test If Function \"getSerializedListOfUsers\" Returns List Of User Entities":
    let listOfUsers = getSerializedListOfUsers(LIST_USER_DATA_TRANSFER_OBJECT_JSON)

    check(%*listOfUsers == LIST_USER_DATA_TRANSFER_OBJECT_JSON)

  test "Test If Function \"getSerializedUser\" Returns User Entities":
    let user = getSerializedUser(USER_DATA_TRANSFER_OBJECT_JSON)

    check(%*user == USER_DATA_TRANSFER_OBJECT_JSON)

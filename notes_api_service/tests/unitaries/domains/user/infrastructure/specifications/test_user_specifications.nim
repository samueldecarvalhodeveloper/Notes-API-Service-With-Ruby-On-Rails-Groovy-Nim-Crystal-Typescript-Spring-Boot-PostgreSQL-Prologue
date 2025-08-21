import unittest2
from ../../../../../../src/domains/user/infrastructure/specifications/user_specifications import
  isUserNotExisting,
  isUserAlreadyExisting
from ../../../../../../src/constants/server_constants import
  OK_STATUS_CODE, NOT_FOUND_STATUS_CODE,
  CONFLICT_STATUS_CODE

suite "Test Module \"User Specifications\" Behavior":
  test "Test If Function \"isUserNotExisting\" Returns True If Response Status Code Is Not Found":
    let userIsNotFound = isUserNotExisting(NOT_FOUND_STATUS_CODE)
    let userIsFound = isUserNotExisting(OK_STATUS_CODE)

    check(userIsNotFound)
    check(not userIsFound)

  test "Test If Function \"isUserAlreadyExisting\" Returns True If Response Status Code Is Conflict":
    let userAlreadyExists = isUserAlreadyExisting(CONFLICT_STATUS_CODE)
    let userNotExists = isUserAlreadyExisting(OK_STATUS_CODE)

    check(userAlreadyExists)
    check(not userNotExists)

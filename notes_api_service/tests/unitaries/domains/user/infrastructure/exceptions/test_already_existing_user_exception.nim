import unittest2
from ../../../../../../src/domains/user/infrastructure/exceptions/already_existing_user_exception import
  AlreadyExistingUserException
from ../../../../../../src/constants/domains/user_constants import
  ALREADY_EXISTING_USER_EXCEPTION_MESSAGE

suite "Test Module \"Already Existing User Exception\" Behavior":
  test "Test If Entity Describes How Error Is Used By The System":
    try:
      raise(newException(AlreadyExistingUserException, ALREADY_EXISTING_USER_EXCEPTION_MESSAGE))
    except AlreadyExistingUserException:
      let exceptionMessage = getCurrentExceptionMsg()

      check(exceptionMessage == ALREADY_EXISTING_USER_EXCEPTION_MESSAGE)


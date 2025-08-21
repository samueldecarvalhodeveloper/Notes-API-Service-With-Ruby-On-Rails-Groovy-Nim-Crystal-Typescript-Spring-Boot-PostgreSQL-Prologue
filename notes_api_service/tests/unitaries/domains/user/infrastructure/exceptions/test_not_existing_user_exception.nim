import unittest2
from ../../../../../../src/domains/user/infrastructure/exceptions/not_existing_user_exception import
  NotExistingUserException
from ../../../../../../src/constants/domains/user_constants import
  NOT_EXISTING_USER_EXCEPTION_MESSAGE

suite "Test Module \"Not Existing User Exception\" Behavior":
  test "Test If Entity Describes How Error Is Used By The System":
    try:
      raise(newException(NotExistingUserException, NOT_EXISTING_USER_EXCEPTION_MESSAGE))
    except NotExistingUserException:
      let exceptionMessage = getCurrentExceptionMsg()

      check(exceptionMessage == NOT_EXISTING_USER_EXCEPTION_MESSAGE)


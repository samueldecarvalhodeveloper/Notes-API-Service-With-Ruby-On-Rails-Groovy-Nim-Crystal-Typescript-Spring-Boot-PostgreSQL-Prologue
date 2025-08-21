import unittest2
from ../../../../src/domains/user/user_validator import
  validateIfUserExists,
  validateIfUserAlreadyExists
from ../../../../src/constants/server_constants import
  NOT_FOUND_STATUS_CODE,
  CONFLICT_STATUS_CODE
from ../../../../src/constants/domains/user_constants import
  NOT_EXISTING_USER_EXCEPTION_MESSAGE,
  ALREADY_EXISTING_USER_EXCEPTION_MESSAGE

suite "Test Module \"User Validator\" Behavior":
  test "Test If Function \"validateIfUserExists\" Throws Not Existing User Exception If Response Status Code Is Not Found":
    try:
      validateIfUserExists(NOT_FOUND_STATUS_CODE)
    except Exception:
      check(getCurrentExceptionMsg() == NOT_EXISTING_USER_EXCEPTION_MESSAGE)
  test "Test If Function \"validateIfUserAlreadyExists\" Throws Already Existing User Exception If Response Status Code Is Conflict":
    try:
      validateIfUserExists(CONFLICT_STATUS_CODE)
    except Exception:
      check(getCurrentExceptionMsg() == ALREADY_EXISTING_USER_EXCEPTION_MESSAGE)

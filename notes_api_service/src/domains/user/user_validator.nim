from infrastructure/specifications/user_specifications import
  isUserNotExisting,
  isUserAlreadyExisting
from infrastructure/exceptions/not_existing_user_exception import
  NotExistingUserException
from infrastructure/exceptions/already_existing_user_exception import
  AlreadyExistingUserException
from ../../constants/domains/user_constants import
  NOT_EXISTING_USER_EXCEPTION_MESSAGE,
  ALREADY_EXISTING_USER_EXCEPTION_MESSAGE

proc validateIfUserExists*(statusCode: int): void =
  if isUserNotExisting(statusCode):
    raise(
      newException(
        NotExistingUserException,
        NOT_EXISTING_USER_EXCEPTION_MESSAGE
      )
    )

proc validateIfUserAlreadyExists*(statusCode: int): void =
  if isUserAlreadyExisting(statusCode):
    raise(
      newException(
        AlreadyExistingUserException,
        ALREADY_EXISTING_USER_EXCEPTION_MESSAGE
      )
    )

import unittest2
from ../../../../src/domains/note/note_validator import
  validateIfNoteExists,
  validateIfNoteAlreadyExists
from ../../../../src/constants/server_constants import
  NOT_FOUND_STATUS_CODE,
  CONFLICT_STATUS_CODE
from ../../../../src/constants/domains/note_constants import
  NOT_EXISTING_NOTE_EXCEPTION_MESSAGE,
  ALREADY_EXISTING_NOTE_EXCEPTION_MESSAGE

suite "Test Module \"Note Validator\" Behavior":
  test "Test If Function \"validateIfNoteExists\" Throws Not Existing Note Exception If Response Status Code Is Not Found":
    try:
      validateIfNoteExists(NOT_FOUND_STATUS_CODE)
    except Exception:
      check(getCurrentExceptionMsg() == NOT_EXISTING_NOTE_EXCEPTION_MESSAGE)
  test "Test If Function \"validateIfNoteAlreadyExists\" Throws Already Existing Note Exception If Response Status Code Is Conflict":
    try:
      validateIfNoteExists(CONFLICT_STATUS_CODE)
    except Exception:
      check(getCurrentExceptionMsg() == ALREADY_EXISTING_NOTE_EXCEPTION_MESSAGE)

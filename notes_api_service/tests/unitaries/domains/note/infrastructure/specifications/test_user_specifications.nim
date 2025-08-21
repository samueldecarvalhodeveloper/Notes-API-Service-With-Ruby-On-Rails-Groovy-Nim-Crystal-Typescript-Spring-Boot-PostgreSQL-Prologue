import unittest2
from ../../../../../../src/domains/note/infrastructure/specifications/note_specifications import
  isNoteNotExisting,
  isNoteAlreadyExisting
from ../../../../../../src/constants/server_constants import
  OK_STATUS_CODE, NOT_FOUND_STATUS_CODE,
  CONFLICT_STATUS_CODE

suite "Test Module \"Note Specifications\" Behavior":
  test "Test If Function \"isNoteNotExisting\" Returns True If Response Status Code Is Not Found":
    let noteIsNotFound = isNoteNotExisting(NOT_FOUND_STATUS_CODE)
    let noteIsFound = isNoteNotExisting(OK_STATUS_CODE)

    check(noteIsNotFound)
    check(not noteIsFound)

  test "Test If Function \"isNoteAlreadyExisting\" Returns True If Response Status Code Is Conflict":
    let noteAlreadyExists = isNoteAlreadyExisting(CONFLICT_STATUS_CODE)
    let noteNotExists = isNoteAlreadyExisting(OK_STATUS_CODE)

    check(noteAlreadyExists)
    check(not noteNotExists)

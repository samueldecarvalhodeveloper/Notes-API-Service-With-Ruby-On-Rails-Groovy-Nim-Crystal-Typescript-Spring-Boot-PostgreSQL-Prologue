import unittest2
from ../../../../../../src/domains/note/infrastructure/exceptions/already_existing_note_exception import AlreadyExistingNoteException
from ../../../../../../src/constants/domains/note_constants import ALREADY_EXISTING_NOTE_EXCEPTION_MESSAGE

suite "Test Module \"Already Existing Note Exception\" Behavior":
  test "Test If Entity Describes How Error Is Used By The System":
    try:
      raise(newException(AlreadyExistingNoteException, ALREADY_EXISTING_NOTE_EXCEPTION_MESSAGE))
    except AlreadyExistingNoteException:
      let exceptionMessage = getCurrentExceptionMsg()

      check(exceptionMessage == ALREADY_EXISTING_NOTE_EXCEPTION_MESSAGE)


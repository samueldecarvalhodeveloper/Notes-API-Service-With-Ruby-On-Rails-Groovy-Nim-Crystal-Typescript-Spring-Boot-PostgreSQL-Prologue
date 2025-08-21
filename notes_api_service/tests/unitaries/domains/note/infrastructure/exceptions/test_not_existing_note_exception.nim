import unittest2
from ../../../../../../src/domains/note/infrastructure/exceptions/not_existing_note_exception import
  NotExistingNoteException
from ../../../../../../src/constants/domains/note_constants import
  NOT_EXISTING_NOTE_EXCEPTION_MESSAGE

suite "Test Module \"Not Existing Note Exception\" Behavior":
  test "Test If Entity Describes How Error Is Used By The System":
    try:
      raise(newException(NotExistingNoteException, NOT_EXISTING_NOTE_EXCEPTION_MESSAGE))
    except NotExistingNoteException:
      let exceptionMessage = getCurrentExceptionMsg()

      check(exceptionMessage == NOT_EXISTING_NOTE_EXCEPTION_MESSAGE)


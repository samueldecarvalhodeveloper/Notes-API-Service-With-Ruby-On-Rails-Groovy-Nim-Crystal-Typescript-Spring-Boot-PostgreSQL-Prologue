from infrastructure/specifications/note_specifications import
  isNoteNotExisting,
  isNoteAlreadyExisting
from infrastructure/exceptions/not_existing_note_exception import
  NotExistingNoteException
from infrastructure/exceptions/already_existing_note_exception import
  AlreadyExistingNoteException
from ../../constants/domains/note_constants import
  NOT_EXISTING_NOTE_EXCEPTION_MESSAGE,
  ALREADY_EXISTING_NOTE_EXCEPTION_MESSAGE

proc validateIfNoteExists*(statusCode: int): void =
  if isNoteNotExisting(statusCode):
    raise(
      newException(
        NotExistingNoteException,
        NOT_EXISTING_NOTE_EXCEPTION_MESSAGE
      )
    )

proc validateIfNoteAlreadyExists*(statusCode: int): void =
  if isNoteAlreadyExisting(statusCode):
    raise(
      newException(
        AlreadyExistingNoteException,
        ALREADY_EXISTING_NOTE_EXCEPTION_MESSAGE
      )
    )

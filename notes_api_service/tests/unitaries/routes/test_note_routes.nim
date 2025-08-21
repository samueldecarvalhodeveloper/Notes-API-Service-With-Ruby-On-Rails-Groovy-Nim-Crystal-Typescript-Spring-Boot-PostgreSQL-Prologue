import unittest2
import httpclient
import strformat
import json
from ../../concerns/run_server_on_background_thread import
  runServerOnBackgroundThread
from ../../../src/infrastructure/concerns/http_client_implementation_factory import
  getHttpClientImplementationInstance
from ../../../src/constants/server_constants import
  SERVER_HOST
from ../../../src/constants/routes_constants import
  NOTE_ROUTE
from ../../../src/constants/domains/user_constants import
  USER_ID,
  USER_OBJECT
from ../../../src/constants/domains/note_constants import
  NOTE_ID,
  NOTE_OBJECT,
  NOTE_JSON,
  NOTE_JSON_WITH_WRONG_DATA,
  NOTE_OBJECT_WITH_WRONG_DATA,
  NOT_EXISTING_NOTE_EXCEPTION_MESSAGE,
  NOTE_TITLE,
  NOTE_BODY
from ../../../src/domains/user/user_repository import
  createUser,
  deleteUser
from ../../../src/domains/note/note_repository import
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote

suite "Test Module \"Note Routes\" Behavior":
  let httpClientImplementation = getHttpClientImplementationInstance()

  runServerOnBackgroundThread()

  setup:
    try:
      createUser(USER_OBJECT)
    except Exception:
      discard()

  teardown:
    try:
      deleteUser(USER_ID)
    except Exception:
      discard()

  test "Test If Function \"createNoteRoutes\" Sets Note Routes":
    let notesRequestResponse =
      httpClientImplementation.getContent(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/"))

    let notesFromServer = parseJson(notesRequestResponse)

    let notesFromDatabase = getNotes(USER_ID)

    check(notesFromServer == %*notesFromDatabase)

    discard(httpClientImplementation.post(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/"), $NOTE_JSON_WITH_WRONG_DATA))

    let createdNote = getNotes(USER_ID)[0]

    let noteRequestResponse =
      httpClientImplementation.getContent(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/{createdNote.id}/"))

    let noteFromServer  = parseJson(noteRequestResponse)

    let noteFromDatabase = getNote(createdNote.id, USER_ID)

    check(noteFromServer == %*noteFromDatabase)

    discard(httpClientImplementation.patch(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/{createdNote.id}/"), $NOTE_JSON))

    let updatedNoteFromDatabase = getNote(createdNote.id, USER_ID)

    check(NOTE_TITLE == updatedNoteFromDatabase.title)
    check(NOTE_BODY == updatedNoteFromDatabase.body)

    discard(httpClientImplementation.delete(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/{createdNote.id}/")))

    try:
      discard(getNote(createdNote.id, USER_ID))
    except Exception:
      check(getCurrentExceptionMsg() == NOT_EXISTING_NOTE_EXCEPTION_MESSAGE)

import unittest2
import httpclient
import strformat
import strutils
import json
from ../../concerns/run_server_on_background_thread import
  runServerOnBackgroundThread
from ../../../src/infrastructure/concerns/http_client_implementation_factory import
  getHttpClientImplementationInstance
from ../../../src/constants/server_constants import
  SERVER_HOST,
  NOT_FOUND_STATUS_CODE,
  CREATED_STATUS_CODE,
  CONFLICT_STATUS_CODE,
  OK_STATUS_CODE,
  JSON_MESSAGE_KEY,
  NO_CONTENT_STATUS_CODE
from ../../../src/constants/routes_constants import
  NOTE_ROUTE
from ../../../src/constants/domains/user_constants import
  USER_ID,
  USER_OBJECT,
  NOT_EXISTING_USER_EXCEPTION_MESSAGE
from ../../../src/constants/domains/note_constants import
  NOTE_ID,
  NOTE_OBJECT,
  NOTE_JSON,
  NOT_EXISTING_NOTE_EXCEPTION_MESSAGE,
  NOTE_OBJECT_WITH_WRONG_DATA,
  NOTE_TITLE_KEY,
  NOTE_BODY_KEY,
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

suite "Test Module \"Note Controller\" Behavior":
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

  test "Test If Function \"getNotes\" Responds To Client All Notes":
    let requestResponse =
      httpClientImplementation.getContent(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/"))

    let notesFromDatabase = parseJson(requestResponse)

    let notes = getNotes(USER_ID)

    check(%*notes == notesFromDatabase)

  test "Test If Function \"getNotes\" Responds To Client Not Found If User Does Not Exist":
    deleteUser(USER_ID)

    try:
      discard(httpClientImplementation.getContent(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/")))
    except Exception:
      check(getCurrentExceptionMsg()[0..2] == $NOT_FOUND_STATUS_CODE)

  test "Test If Function \"getNote\" Responds To Client Note":
    createNote(NOTE_OBJECT)

    let requestResponse =
      httpClientImplementation.getContent(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/{NOTE_ID}/"))

    let noteFromDatabase = parseJson(requestResponse)

    let note = getNote(NOTE_ID, USER_ID)

    check(%*note == noteFromDatabase)

  test "Test If Function \"getNote\" Responds To Client Not Found If Note Does Not Exist":
    try:
      discard(httpClientImplementation.getContent(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/{NOTE_ID}/")))
    except Exception:
      check(getCurrentExceptionMsg()[0..2] == $NOT_FOUND_STATUS_CODE)

  test "Test If Function \"createNote\" Responds To Client Created If Note Was Created And The Content Of Note":
    let noteCreatingRequestResponse =
      httpClientImplementation.post(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/"), $NOTE_JSON)

    check(parseInt(noteCreatingRequestResponse.status) == CREATED_STATUS_CODE)

    let note = getNotes(USER_ID)[0]

    check(note.title == NOTE_TITLE)
    check(note.body == NOTE_BODY)

  test "Test If Function \"createNote\" Responds To Client Not Found If User Does Not Exist":
    deleteUser(USER_ID)

    let noteCreatingRequestResponse =
      httpClientImplementation.post(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/"), $NOTE_JSON)

    check(parseInt(noteCreatingRequestResponse.status) == NOT_FOUND_STATUS_CODE)

    check(noteCreatingRequestResponse.body() == $(%*{ JSON_MESSAGE_KEY: NOT_EXISTING_USER_EXCEPTION_MESSAGE }))

  test "Test If Function \"updateNote\" Responds To Client Ok If Note Was Updated And The Content Of Note":
    createNote(NOTE_OBJECT_WITH_WRONG_DATA)

    let noteUpdatingRequestResponse =
      httpClientImplementation.patch(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/{NOTE_ID}/"), $NOTE_JSON)

    check(parseInt(noteUpdatingRequestResponse.status) == OK_STATUS_CODE)

    check(parseJson(noteUpdatingRequestResponse.body())[NOTE_TITLE_KEY].getStr() == NOTE_TITLE)
    check(parseJson(noteUpdatingRequestResponse.body())[NOTE_BODY_KEY].getStr() == NOTE_BODY)

  test "Test If Function \"updateNote\" Responds To Client Not Found If Note Does Not Exist":
    let noteUpdatingRequestResponse =
      httpClientImplementation.patch(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/{NOTE_ID}/"), $NOTE_JSON)

    check(parseInt(noteUpdatingRequestResponse.status) == NOT_FOUND_STATUS_CODE)

    check(noteUpdatingRequestResponse.body() == $(%*{ JSON_MESSAGE_KEY: NOT_EXISTING_NOTE_EXCEPTION_MESSAGE }))

  test "Test If Function \"deleteNote\" Responds To Client No Content If Note Was Deleted And The Content Of Note":
    createNote(NOTE_OBJECT)

    let noteDeletingRequestResponse =
      httpClientImplementation.delete(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/{NOTE_ID}/"))

    check(parseInt(noteDeletingRequestResponse.status) == NO_CONTENT_STATUS_CODE)

  test "Test If Function \"deleteNote\" Responds To Client Not Found If Note Does Not Exist":
    let noteDeletingRequestResponse =
      httpClientImplementation.delete(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/{NOTE_ID}/"))

    check(parseInt(noteDeletingRequestResponse.status) == NOT_FOUND_STATUS_CODE)

    check(noteDeletingRequestResponse.body() == $(%*{ JSON_MESSAGE_KEY: NOT_EXISTING_NOTE_EXCEPTION_MESSAGE }))

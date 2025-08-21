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
  JSON_MESSAGE_KEY,
  NOT_FOUND_ERROR_MESSAGE
from ../../../src/constants/routes_constants import
  USER_ROUTE,
  NOTE_ROUTE
from ../../../src/constants/domains/user_constants import
  USER_ID,
  USER_OBJECT,
  USER_JSON
from ../../../src/constants/domains/note_constants import
  NOTE_ID,
  NOTE_OBJECT,
  NOTE_JSON
from ../../../src/domains/user/user_repository import
  getUser,
  createUser,
  deleteUser
from ../../../src/domains/note/note_repository import
  getNote,
  createNote,
  deleteNote

suite "Test Module \"Server\" Behavior":
  let httpClientImplementation = getHttpClientImplementationInstance()

  runServerOnBackgroundThread()

  setup:
    try:
      deleteUser(USER_ID)
      deleteNote(NOTE_ID, USER_ID)
    except Exception:
      discard()


  test "Test If App Is Configured":
    createUser(USER_OBJECT)
    createNote(NOTE_OBJECT)

    let userRequestResponse = httpClientImplementation.getContent(fmt("{SERVER_HOST}{USER_ROUTE}/{USER_ID}/"))

    let userFromDatabase = parseJson(userRequestResponse)

    let user = getuser(USER_ID)

    check(%*user == userFromDatabase)

    let noteRequestResponse = httpClientImplementation.getContent(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/{NOTE_ID}/"))

    let noteFromDatabase = parseJson(noteRequestResponse)

    let note = getNote(NOTE_ID, USER_ID)

    check(%*note == noteFromDatabase)

    deleteNote(NOTE_OBJECT.id, NOTE_OBJECT.userId)
    deleteUser(USER_OBJECT.id)

    let notExistingRouteRequestResponse =
      httpClientImplementation.get(fmt("{SERVER_HOST}/"))

    check(parseInt(notExistingRouteRequestResponse.status) == NOT_FOUND_STATUS_CODE)

    check(notExistingRouteRequestResponse.body() == $(%*{ JSON_MESSAGE_KEY: NOT_FOUND_ERROR_MESSAGE }))

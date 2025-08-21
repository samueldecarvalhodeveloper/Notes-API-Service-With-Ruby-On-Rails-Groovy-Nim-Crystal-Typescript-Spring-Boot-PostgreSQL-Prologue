import unittest2
import httpclient
import strformat
import strutils
import json
from ../concerns/run_server_on_background_thread import
  runServerOnBackgroundThread
from ../../src/domains/user/user_repository import
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
from ../../src/domains/note/note_repository import
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
from ../../src/constants/server_constants import
  MESSAGE_QUEUE_SERVICE_URL,
  NOT_FOUND_STATUS_CODE,
  SERVER_HOST,
  NO_CONTENT_STATUS_CODE,
  OK_STATUS_CODE,
  CONFLICT_STATUS_CODE,
  CREATED_STATUS_CODE,
  JSON_MESSAGE_KEY
from ../../src/constants/routes_constants import
  USER_ROUTE,
  NOTE_ROUTE
from ../../src/infrastructure/concerns/http_client_implementation_factory import
  getHttpClientImplementationInstance
from ../../src/constants/domains/user_constants import
  USER_ID,
  USER_JSON,
  USER_OBJECT,
  ALREADY_EXISTING_USER_EXCEPTION_MESSAGE,
  NOT_EXISTING_USER_EXCEPTION_MESSAGE,
  USER_OBJECT_WITH_WRONG_DATA,
  USER_DATA_TRANSFER_OBJECT_JSON,
  USER_USERNAME
from ../../src/constants/domains/note_constants import
  NOTE_ID,
  NOTE_TITLE,
  NOTE_BODY,
  NOTE_CREATED_AT,
  NOTE_UPDATED_AT,
  WRONG_NOTE_TITLE,
  NOTE_JSON,
  NOTE_JSON_WITH_WRONG_DATA,
  NOTE_OBJECT,
  NOTE_OBJECT_WITH_WRONG_DATA,
  NOTE_TITLE_KEY,
  NOTE_BODY_KEY

suite "Test System System Behavior":
  let httpClientImplementation = getHttpClientImplementationInstance()

  runServerOnBackgroundThread()

  setup:
    try:
      let users = getUsers()

      for user in users:
        deleteUser(user.id)
    except Exception:
      discard()

  teardown:
    try:
      let users = getUsers()

      for user in users:
        deleteUser(user.id)
    except Exception:
      discard()

  test "Test System Responding To Client All Users":
    let requestResponse =
      httpClientImplementation.getContent(fmt("{SERVER_HOST}{USER_ROUTE}/"))

    let usersFromDatabase = parseJson(requestResponse)

    let users = getUsers()

    check(%*users == usersFromDatabase)

  test "Test System Responding To Client User":
    createUser(USER_OBJECT)

    let requestResponse =
      httpClientImplementation.getContent(fmt("{SERVER_HOST}{USER_ROUTE}/{USER_ID}/"))

    let userFromDatabase = parseJson(requestResponse)

    let user = getUser(USER_ID)

    check(%*user == userFromDatabase)

  test "Test System Creating User":
    let userCreatingRequestResponse =
      httpClientImplementation.post(fmt("{SERVER_HOST}{USER_ROUTE}/"), $USER_JSON)

    check(parseInt(userCreatingRequestResponse.status) == CREATED_STATUS_CODE)

    let createdUser = getUsers()[0]

    let user = getUser(createdUser.id)

    check(user.username == USER_USERNAME)

  test "Test System Updating User":
    createUser(USER_OBJECT_WITH_WRONG_DATA)

    let userUpdatingRequestResponse =
      httpClientImplementation.patch(fmt("{SERVER_HOST}{USER_ROUTE}/{USER_ID}/"), $USER_JSON)

    check(parseInt(userUpdatingRequestResponse.status) == OK_STATUS_CODE)

    check(userUpdatingRequestResponse.body() == $USER_DATA_TRANSFER_OBJECT_JSON)

  test "Test System Deleting User":
    createUser(USER_OBJECT)

    let userDeletingRequestResponse =
      httpClientImplementation.delete(fmt("{SERVER_HOST}{USER_ROUTE}/{USER_ID}/"))

    check(parseInt(userDeletingRequestResponse.status) == NO_CONTENT_STATUS_CODE)

  test "Test System Responding To Client All User Notes":
    createUser(USER_OBJECT)

    let requestResponse =
      httpClientImplementation.getContent(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/"))

    let notesFromDatabase = parseJson(requestResponse)

    let notes = getNotes(USER_ID)

    check(%*notes == notesFromDatabase)

  test "Test System Responding To Client Note":
    createUser(USER_OBJECT)

    createNote(NOTE_OBJECT)

    let requestResponse =
      httpClientImplementation.getContent(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/{NOTE_ID}/"))

    let noteFromDatabase = parseJson(requestResponse)

    let note = getNote(NOTE_ID, USER_ID)

    check(%*note == noteFromDatabase)

  test "Test System Creating Note":
    createUser(USER_OBJECT)

    let noteCreatingRequestResponse =
      httpClientImplementation.post(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/"), $NOTE_JSON)

    check(parseInt(noteCreatingRequestResponse.status) == CREATED_STATUS_CODE)

    let note = getNotes(USER_ID)[0]

    check(note.title == NOTE_TITLE)
    check(note.body == NOTE_BODY)

  test "Test System Updating Note":
    createUser(USER_OBJECT)

    createNote(NOTE_OBJECT_WITH_WRONG_DATA)

    let noteUpdatingRequestResponse =
      httpClientImplementation.patch(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/{NOTE_ID}/"), $NOTE_JSON)

    check(parseInt(noteUpdatingRequestResponse.status) == OK_STATUS_CODE)

    check(parseJson(noteUpdatingRequestResponse.body())[NOTE_TITLE_KEY].getStr() == NOTE_TITLE)
    check(parseJson(noteUpdatingRequestResponse.body())[NOTE_BODY_KEY].getStr() == NOTE_BODY)

  test "Test System Deleting Note":
    createUser(USER_OBJECT)

    createNote(NOTE_OBJECT)

    let noteDeletingRequestResponse =
      httpClientImplementation.delete(fmt("{SERVER_HOST}{NOTE_ROUTE}/{USER_ID}/{NOTE_ID}/"))

    check(parseInt(noteDeletingRequestResponse.status) == NO_CONTENT_STATUS_CODE)

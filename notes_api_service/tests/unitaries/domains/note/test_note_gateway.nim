import unittest2
import httpclient
import strformat
import json
from ../../../../src/domains/note/note_gateway import
  getNotesFromDatabase,
  getNoteFromDatabase,
  createNoteOnDatabase,
  updateNoteOnDatabase,
  deleteNoteOnDatabase
from ../../../../src/constants/server_constants import
  MESSAGE_QUEUE_SERVICE_URL,
  NOT_FOUND_STATUS_CODE
from ../../../../src/constants/routes_constants import
  USER_ROUTE,
  NOTE_ROUTE
from ../../../../src/infrastructure/concerns/http_client_implementation_factory import
  getHttpClientImplementationInstance
from ../../../../src/constants/domains/user_constants import
  USER_ID,
  USER_JSON,
  NOT_EXISTING_USER_EXCEPTION_MESSAGE
from ../../../../src/constants/domains/note_constants import
  NOTE_ID,
  NOTE_TITLE,
  NOTE_BODY,
  NOTE_CREATED_AT,
  NOTE_UPDATED_AT,
  WRONG_NOTE_TITLE,
  NOTE_DATA_TRANSFER_OBJECT_JSON,
  NOTE_DATA_TRANSFER_OBJECT_JSON_WITH_WRONG_DATA,
  NOTE_OBJECT,
  NOT_EXISTING_NOTE_EXCEPTION_MESSAGE,
  ALREADY_EXISTING_NOTE_EXCEPTION_MESSAGE

suite "Test Module \"Note Gateway\" Behavior":
  let httpClientImplementation = getHttpClientImplementationInstance()

  setup:
    try:
      discard(httpClientImplementation.postContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/"), $USER_JSON))

      discard(httpClientImplementation.deleteContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{USER_ID}/{NOTE_ID}/")))
    except Exception:
      discard()

  teardown:
    try:
      discard(httpClientImplementation.deleteContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{USER_ID}/{NOTE_ID}/")))

      discard(httpClientImplementation.deleteContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/{USER_ID}/")))
    except Exception:
      discard()

  test "Test If Function \"getNotesFromDatabase\" Returns List Of Notes From Database":
    let requestResponse = httpClientImplementation.getContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{USER_ID}/"))

    let listOfNotesFromDatabase = parseJson(requestResponse)

    let notes = getNotesFromDatabase(USER_ID)

    check(%*notes == listOfNotesFromDatabase)

  test "Test If Function \"getNotesFromDatabase\" Throws Not Existing User Exception If User Does Not Exist On Database":
    discard(httpClientImplementation.deleteContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/{USER_ID}/")))

    try:
      discard(getNotesFromDatabase(USER_ID))
    except Exception:
      check(getCurrentExceptionMsg() == NOT_EXISTING_USER_EXCEPTION_MESSAGE)

  test "Test If Function \"getNoteFromDatabase\" Returns Note From Database":
    discard(httpClientImplementation.postContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{USER_ID}/"), $NOTE_DATA_TRANSFER_OBJECT_JSON))

    let requestResponse = httpClientImplementation.getContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{USER_ID}/{NOTE_ID}/"))

    let noteFromDatabase = parseJson(requestResponse)

    let note = getNoteFromDatabase(NOTE_ID, USER_ID)

    check(%*note == noteFromDatabase)

  test "Test If Function \"getNoteFromDatabase\" Throws Not Existing Note If Note Does Not Exist On Database":
    try:
      discard(getNoteFromDatabase(NOTE_ID, USER_ID))
    except Exception:
      check(getCurrentExceptionMsg() == NOT_EXISTING_NOTE_EXCEPTION_MESSAGE)

  test "Test If Function \"createNoteOnDatabase\" Creates Note From Database":
    createNoteOnDatabase(NOTE_OBJECT)

    let requestResponse = httpClientImplementation.getContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{USER_ID}/{NOTE_ID}/"))

    let noteFromDatabase = parseJson(requestResponse)

    check(noteFromDatabase == NOTE_DATA_TRANSFER_OBJECT_JSON)

  test "Test If Function \"createNoteOnDatabase\" Throws Not Existing User If User Does Not Exist On Database":
    discard(httpClientImplementation.deleteContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/{USER_ID}/")))

    try:
      createNoteOnDatabase(NOTE_OBJECT)
    except Exception:
      check(getCurrentExceptionMsg() == NOT_EXISTING_USER_EXCEPTION_MESSAGE)

  test "Test If Function \"createNoteOnDatabase\" Raises Already Existsing Note Exception If Note Already Exists On Database":
    createNoteOnDatabase(NOTE_OBJECT)

    try:
      createNoteOnDatabase(NOTE_OBJECT)
    except Exception:
      check(getCurrentExceptionMsg() == ALREADY_EXISTING_NOTE_EXCEPTION_MESSAGE)

  test "Test If Function \"updateNoteOnDatabase\" Updates User On Database":
    discard(httpClientImplementation.postContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{USER_ID}/"), $NOTE_DATA_TRANSFER_OBJECT_JSON_WITH_WRONG_DATA))

    updateNoteOnDatabase(NOTE_OBJECT)

    let requestResponse = httpClientImplementation.getContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{USER_ID}/{NOTE_ID}/"))

    let noteFromDatabase = parseJson(requestResponse)

    check(noteFromDatabase == NOTE_DATA_TRANSFER_OBJECT_JSON)

  test "Test If Function \"updateNoteOnDatabase\" Throws Not Existing Note If Note Does Not Exist On Database":
    try:
      updateNoteOnDatabase(NOTE_OBJECT)
    except Exception:
      check(getCurrentExceptionMsg() == NOT_EXISTING_NOTE_EXCEPTION_MESSAGE)

  test "Test If Function \"deleteNoteOnDatabase\" Deletes Note On Database":
    discard(httpClientImplementation.postContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{USER_ID}/"), $NOTE_DATA_TRANSFER_OBJECT_JSON))

    deleteNoteOnDatabase(NOTE_ID, USER_ID)

    try:
      discard(httpClientImplementation.getContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/{USER_ID}/")))
    except Exception:
      check(getCurrentExceptionMsg()[0..2] == $NOT_FOUND_STATUS_CODE)

  test "Test If Function \"deleteNoteOnDatabase\" Raises Not Existing Note Exception If Note Does Not Exist On Database":
    try:
      deleteNoteOnDatabase(NOTE_ID, USER_ID)
    except Exception:
      check(getCurrentExceptionMsg() == $NOT_EXISTING_NOTE_EXCEPTION_MESSAGE)

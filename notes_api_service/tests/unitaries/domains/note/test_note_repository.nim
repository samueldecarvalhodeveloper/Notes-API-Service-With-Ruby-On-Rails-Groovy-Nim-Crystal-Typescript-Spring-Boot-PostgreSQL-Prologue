import unittest2
import httpclient
import strformat
import json
from ../../../../src/domains/note/note_repository import
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
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
  USER_JSON
from ../../../../src/constants/domains/note_constants import
  NOTE_ID,
  NOTE_TITLE,
  NOTE_BODY,
  NOTE_CREATED_AT,
  NOTE_UPDATED_AT,
  WRONG_NOTE_TITLE,
  NOTE_DATA_TRANSFER_OBJECT_JSON,
  NOTE_DATA_TRANSFER_OBJECT_JSON_WITH_WRONG_DATA,
  NOTE_OBJECT

suite "Test Module \"Note Repository\" Behavior":
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

    except Exception:
      discard()

  test "Test If Function \"getNotes\" Returns List Of Notes From Database":
    let requestResponse = httpClientImplementation.getContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{USER_ID}/"))

    let listOfNotesFromDatabase = parseJson(requestResponse)

    let notes = getNotes(USER_ID)

    check(%*notes == listOfNotesFromDatabase)

  test "Test If Function \"getNote\" Returns Note From Database":
    discard(httpClientImplementation.postContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{USER_ID}/"), $NOTE_DATA_TRANSFER_OBJECT_JSON))

    let requestResponse = httpClientImplementation.getContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{USER_ID}/{NOTE_ID}/"))

    let noteFromDatabase = parseJson(requestResponse)

    let note = getNote(NOTE_ID, USER_ID)

    check(%*note == noteFromDatabase)

  test "Test If Function \"createNote\" Creates Note From Database":
    createNote(NOTE_OBJECT)

    let requestResponse = httpClientImplementation.getContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{USER_ID}/{NOTE_ID}/"))

    let noteFromDatabase = parseJson(requestResponse)

    check(noteFromDatabase == NOTE_DATA_TRANSFER_OBJECT_JSON)

  test "Test If Function \"updateNote\" Updates User On Database":
    discard(httpClientImplementation.postContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{USER_ID}/"), $NOTE_DATA_TRANSFER_OBJECT_JSON_WITH_WRONG_DATA))

    updateNote(NOTE_OBJECT)

    let requestResponse = httpClientImplementation.getContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{USER_ID}/{NOTE_ID}/"))

    let noteFromDatabase = parseJson(requestResponse)

    check(noteFromDatabase == NOTE_DATA_TRANSFER_OBJECT_JSON)

  test "Test If Function \"deleteNote\" Deletes Note On Database":
    discard(httpClientImplementation.postContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{USER_ID}/"), $NOTE_DATA_TRANSFER_OBJECT_JSON))

    deleteNote(NOTE_ID, USER_ID)

    try:
      discard(httpClientImplementation.getContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/{USER_ID}/")))
    except Exception:
      check(getCurrentExceptionMsg()[0..2] == $NOT_FOUND_STATUS_CODE)

  discard(httpClientImplementation.deleteContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/{USER_ID}/")))

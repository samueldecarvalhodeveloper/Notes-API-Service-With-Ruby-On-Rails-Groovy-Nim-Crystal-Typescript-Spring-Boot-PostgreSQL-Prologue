import unittest2
import httpclient
import strformat
import json
from ../../../../src/domains/user/user_gateway import
  getUsersFromDatabase,
  getUserFromDatabase,
  createUserOnDatabase,
  updateUserOnDatabase,
  deleteUserOnDatabase
from ../../../../src/constants/server_constants import
  MESSAGE_QUEUE_SERVICE_URL,
  NOT_FOUND_STATUS_CODE
from ../../../../src/constants/routes_constants import USER_ROUTE
from ../../../../src/infrastructure/concerns/http_client_implementation_factory import
  getHttpClientImplementationInstance
from ../../../../src/constants/domains/user_constants import
  USER_ID,
  USER_USERNAME,
  USER_JSON,
  USER_OBJECT,
  USER_JSON_WITH_WRONG_DATA,
  NOT_EXISTING_USER_EXCEPTION_MESSAGE,
  ALREADY_EXISTING_USER_EXCEPTION_MESSAGE,
  USER_DATA_TRANSFER_OBJECT_JSON

suite "Test Module \"User Gateway\" Behavior":
  let httpClientImplementation = getHttpClientImplementationInstance()

  setup:
    try:
      discard(httpClientImplementation.deleteContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/{USER_ID}/")))
    except Exception:
      discard()

  teardown:
    try:
      discard(httpClientImplementation.deleteContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/{USER_ID}/")))
    except Exception:
      discard()

  test "Test If Function \"getUsersFromDatabase\" Returns List Of Users From Database":
    let requestResponse = httpClientImplementation.getContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/"))

    let listOfUsersFromDatabase = parseJson(requestResponse)

    let users = getUsersFromDatabase()

    check(%*users == listOfUsersFromDatabase)

  test "Test If Function \"getUserFromDatabase\" Returns User From Database":
    discard(httpClientImplementation.postContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/"), $USER_JSON))

    let user = getUserFromDatabase(USER_ID)

    check(user.id == USER_ID)
    check(user.username == USER_USERNAME)

  test "Test If Function \"getUserFromDatabase\" Raises Not Existing User Exception If User Does Not Exist On Database":
    try:
      discard(getUserFromDatabase(USER_ID))
    except Exception:
      check(getCurrentExceptionMsg() == NOT_EXISTING_USER_EXCEPTION_MESSAGE)

  test "Test If Function \"createUserOnDatabase\" Creates User From Database":
    createUserOnDatabase(USER_OBJECT)

    let user = parseJson(httpClientImplementation.getContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/{USER_ID}/")))

    check(user == USER_DATA_TRANSFER_OBJECT_JSON)

  test "Test If Function \"createUserOnDatabase\" Raises Already Existing User Exception If User Already Exist On Database":
    createUserOnDatabase(USER_OBJECT)

    try:
      createUserOnDatabase(USER_OBJECT)
    except Exception:
      check(getCurrentExceptionMsg() == ALREADY_EXISTING_USER_EXCEPTION_MESSAGE)

  test "Test If Function \"updateUserOnDatabase\" Updates User On Database":
    discard(httpClientImplementation.postContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/"), $USER_JSON_WITH_WRONG_DATA))

    updateUserOnDatabase(USER_OBJECT)

    let user = parseJson(httpClientImplementation.getContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/{USER_ID}/")))

    check(user == USER_DATA_TRANSFER_OBJECT_JSON)

  test "Test If Function \"updateUserOnDatabase\" Raises Not Existing User Exception If User Does Not Exist On Database":
    try:
      updateUserOnDatabase(USER_OBJECT)
    except Exception:
      check(getCurrentExceptionMsg() == NOT_EXISTING_USER_EXCEPTION_MESSAGE)

  test "Test If Function \"deleteUserOnDatabase\" Deletes User From Database":
    discard(httpClientImplementation.postContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/"), $USER_JSON))

    deleteUserOnDatabase(USER_ID)

    try:
      discard(httpClientImplementation.getContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/{USER_ID}/")))
    except Exception:
      check(getCurrentExceptionMsg()[0..2] == $NOT_FOUND_STATUS_CODE)

  test "Test If Function \"deleteUserOnDatabase\" Raises Not Existing User Exception If User Does Not Exist On Database":
    try:
      deleteUserOnDatabase(USER_ID)
    except Exception:
      check(getCurrentExceptionMsg() == NOT_EXISTING_USER_EXCEPTION_MESSAGE)

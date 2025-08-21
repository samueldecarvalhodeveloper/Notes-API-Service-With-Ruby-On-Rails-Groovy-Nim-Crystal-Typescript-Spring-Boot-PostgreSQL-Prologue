import unittest2
import httpclient
import strformat
import json
from ../../src/domains/user/user_repository import
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
from ../../src/constants/server_constants import
  MESSAGE_QUEUE_SERVICE_URL,
  NOT_FOUND_STATUS_CODE
from ../../src/constants/routes_constants import USER_ROUTE
from ../../src/infrastructure/concerns/http_client_implementation_factory import
  getHttpClientImplementationInstance
from ../../src/constants/domains/user_constants import
  USER_ID,
  USER_USERNAME,
  USER_JSON,
  USER_OBJECT,
  USER_JSON_WITH_WRONG_DATA,
  USER_DATA_TRANSFER_OBJECT_JSON

suite "Test Component \"Note\" Behavior":
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

  test "Test Fetching All Users":
    let requestResponse = httpClientImplementation.getContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/"))

    let listOfUsers = parseJson(requestResponse)

    let users = getUsers()

    check(%*users == listOfUsers)

  test "Test Fetching User":
    discard(httpClientImplementation.postContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/"), $USER_JSON))

    let user = getUser(USER_ID)

    check(user.id == USER_ID)
    check(user.username == USER_USERNAME)

  test "Test Creating User":
    createUser(USER_OBJECT)

    let user = parseJson(httpClientImplementation.getContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/{USER_ID}/")))

    check(user == USER_DATA_TRANSFER_OBJECT_JSON)

  test "Test Updating User":
    discard(httpClientImplementation.postContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/"), $USER_JSON_WITH_WRONG_DATA))

    updateUser(USER_OBJECT)

    let user = parseJson(httpClientImplementation.getContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/{USER_ID}/")))

    check(user == USER_DATA_TRANSFER_OBJECT_JSON)

  test "Test Deleting User":
    discard(httpClientImplementation.postContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/"), $USER_JSON))

    deleteUser(USER_ID)

    try:
      discard(httpClientImplementation.getContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/{USER_ID}/")))
    except Exception:
      check(getCurrentExceptionMsg()[0..2] == $NOT_FOUND_STATUS_CODE)

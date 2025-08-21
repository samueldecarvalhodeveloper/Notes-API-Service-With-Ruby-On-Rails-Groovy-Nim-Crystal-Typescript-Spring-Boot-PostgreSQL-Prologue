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
  USER_ROUTE
from ../../../src/constants/domains/user_constants import
  USER_ID,
  USER_OBJECT,
  NOT_EXISTING_USER_EXCEPTION_MESSAGE,
  USER_JSON,
  USER_OBJECT_WITH_WRONG_DATA,
  USER_USERNAME,
  USER_USERNAME_KEY
from ../../../src/domains/user/user_repository import
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser

suite "Test Module \"User Controller\" Behavior":
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

  test "Test If Function \"getUsers\" Responds To Client All Users":
    let requestResponse =
      httpClientImplementation.getContent(fmt("{SERVER_HOST}{USER_ROUTE}/"))

    let usersFromDatabase = parseJson(requestResponse)

    let users = getUsers()

    check(%*users == usersFromDatabase)

  test "Test If Function \"getUser\" Responds To Client User":
    createUser(USER_OBJECT)

    let requestResponse =
      httpClientImplementation.getContent(fmt("{SERVER_HOST}{USER_ROUTE}/{USER_ID}/"))

    let userFromDatabase = parseJson(requestResponse)

    let user = getUser(USER_ID)

    check(%*user == userFromDatabase)

  test "Test If Function \"getUser\" Responds To Client Not Found If User Does Not Exist":
    try:
      discard(httpClientImplementation.getContent(fmt("{SERVER_HOST}{USER_ROUTE}/{USER_ID}/")))
    except Exception:
      check(getCurrentExceptionMsg()[0..2] == $NOT_FOUND_STATUS_CODE)

  test "Test If Function \"createUser\" Responds To Client Created If User Was Created And The Content Of User":
    let userCreatingRequestResponse =
      httpClientImplementation.post(fmt("{SERVER_HOST}{USER_ROUTE}/"), $USER_JSON)

    check(parseInt(userCreatingRequestResponse.status) == CREATED_STATUS_CODE)

    let user = getUsers()[0]

    check(user.username == USER_USERNAME)

  test "Test If Function \"updateUser\" Responds To Client Ok If User Was Updated And The Content Of User":
    createUser(USER_OBJECT_WITH_WRONG_DATA)

    let userUpdatingRequestResponse =
      httpClientImplementation.patch(fmt("{SERVER_HOST}{USER_ROUTE}/{USER_ID}/"), $USER_JSON)

    check(parseInt(userUpdatingRequestResponse.status) == OK_STATUS_CODE)

    let parserResponseJson = parseJson(userUpdatingRequestResponse.body())

    check(parserResponseJson[USER_USERNAME_KEY].getStr() == USER_USERNAME)

  test "Test If Function \"updateUser\" Responds To Client Not Found If User Does Not Exist":
    let userUpdatingRequestResponse =
      httpClientImplementation.patch(fmt("{SERVER_HOST}{USER_ROUTE}/{USER_ID}/"), $USER_JSON)

    check(parseInt(userUpdatingRequestResponse.status) == NOT_FOUND_STATUS_CODE)

    check(userUpdatingRequestResponse.body() == $(%*{ JSON_MESSAGE_KEY: NOT_EXISTING_USER_EXCEPTION_MESSAGE }))

  test "Test If Function \"deleteUser\" Responds To Client No Content If User Was Deleted And The Content Of User":
    createUser(USER_OBJECT)

    let userDeletingRequestResponse =
      httpClientImplementation.delete(fmt("{SERVER_HOST}{USER_ROUTE}/{USER_ID}/"))

    check(parseInt(userDeletingRequestResponse.status) == NO_CONTENT_STATUS_CODE)

  test "Test If Function \"deleteUser\" Responds To Client Not Found If User Does Not Exist":
    let userDeletingRequestResponse =
      httpClientImplementation.delete(fmt("{SERVER_HOST}{USER_ROUTE}/{USER_ID}/"))

    check(parseInt(userDeletingRequestResponse.status) == NOT_FOUND_STATUS_CODE)

    check(userDeletingRequestResponse.body() == $(%*{ JSON_MESSAGE_KEY: NOT_EXISTING_USER_EXCEPTION_MESSAGE }))

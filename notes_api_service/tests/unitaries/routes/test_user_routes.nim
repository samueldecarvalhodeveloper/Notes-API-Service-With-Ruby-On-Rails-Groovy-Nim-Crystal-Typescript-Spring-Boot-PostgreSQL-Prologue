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
  USER_ROUTE
from ../../../src/constants/domains/user_constants import
  USER_ID,
  USER_OBJECT,
  USER_JSON,
  USER_JSON_WITH_WRONG_DATA,
  NOT_EXISTING_USER_EXCEPTION_MESSAGE,
  USER_USERNAME_KEY
from ../../../src/domains/user/user_repository import
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser

suite "Test Module \"User Routes\" Behavior":
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

  test "Test If Function \"createUserRoutes\" Sets User Routes":
    let usersRequestResponse =
      httpClientImplementation.getContent(fmt("{SERVER_HOST}{USER_ROUTE}/"))

    let usersFromServer = parseJson(usersRequestResponse)

    let usersFromDatabase = getUsers()

    check(usersFromServer == %*usersFromDatabase)

    discard(httpClientImplementation.post(fmt("{SERVER_HOST}{USER_ROUTE}/"), $USER_JSON_WITH_WRONG_DATA))

    let createdUser = getUsers()[0]

    let userRequestResponse =
      httpClientImplementation.getContent(fmt("{SERVER_HOST}{USER_ROUTE}/{createdUser.id}/"))

    let userFromServer = parseJson(userRequestResponse)

    let userFromDatabase = getUser(createdUser.id)

    check(userFromServer == %*userFromDatabase)

    discard(httpClientImplementation.patch(fmt("{SERVER_HOST}{USER_ROUTE}/{USER_ID}/"), $USER_JSON))

    let updatedUserFromDatabase = getUser(createdUser.id)

    check(
      USER_JSON_WITH_WRONG_DATA[USER_USERNAME_KEY].getStr() ==
      updatedUserFromDatabase.username
    )

    discard(httpClientImplementation.delete(fmt("{SERVER_HOST}{USER_ROUTE}/{createdUser.id}/")))

    try:
      discard(getUser(createdUser.id))
    except Exception:
      check(getCurrentExceptionMsg() == NOT_EXISTING_USER_EXCEPTION_MESSAGE)

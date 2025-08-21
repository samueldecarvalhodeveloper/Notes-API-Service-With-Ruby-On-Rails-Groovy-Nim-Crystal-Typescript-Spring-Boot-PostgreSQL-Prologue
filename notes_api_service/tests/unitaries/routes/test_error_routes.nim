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

suite "Test Module \"Error Routes\" Behavior":
  let httpClientImplementation = getHttpClientImplementationInstance()

  runServerOnBackgroundThread()

  test "Test If Function \"createUserRoutes\" Sets User Routes":
    let notExistingRouteRequestResponse =
      httpClientImplementation.get(fmt("{SERVER_HOST}/"))

    check(parseInt(notExistingRouteRequestResponse.status) == NOT_FOUND_STATUS_CODE)

    check(notExistingRouteRequestResponse.body() == $(%*{ JSON_MESSAGE_KEY: NOT_FOUND_ERROR_MESSAGE }))

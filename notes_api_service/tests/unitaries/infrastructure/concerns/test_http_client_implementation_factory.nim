import unittest2
import httpclient
import strformat
import json
from ../../../../src/infrastructure/concerns/http_client_implementation_factory import
  getHttpClientImplementationInstance
from ../../../../src/constants/server_constants import
  MESSAGE_QUEUE_SERVICE_URL,
  NOT_FOUND_STATUS_CODE
from ../../../../src/constants/routes_constants import
  USER_ROUTE
from ../../../../src/constants/domains/user_constants import
  USER_ID,
  USER_JSON,
  USER_USERNAME_KEY,
  USER_USERNAME

suite "Test Module \"Http client Implementation factory\" Behavior":
  try:
    let httpClient = newHttpClient()

    discard(httpClient.deleteContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/{USER_ID}/")))
  except Exception:
    discard()

  test "Test If Function Returns A Working Instance":
    let httpClientImplementation = getHttpClientImplementationInstance()

    discard(httpClientImplementation.postContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/"), $USER_JSON))

    let requestResponse = httpClientImplementation.getContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/{USER_ID}/"))

    let user = parseJson(requestResponse)

    check(user[USER_USERNAME_KEY].getStr() == USER_USERNAME)

  try:
    let httpClient = newHttpClient()

    discard(httpClient.deleteContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/{USER_ID}/")))
  except Exception:
    discard()

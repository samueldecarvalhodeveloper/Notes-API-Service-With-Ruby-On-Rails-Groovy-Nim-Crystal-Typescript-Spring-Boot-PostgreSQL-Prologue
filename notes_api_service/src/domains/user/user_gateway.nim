import strformat
import httpclient
import json
import strutils
from infrastructure/entities/user_entity import UserEntity
from ../../infrastructure/concerns/http_client_implementation_factory import
  getHttpClientImplementationInstance
from ../../constants/server_constants import MESSAGE_QUEUE_SERVICE_URL
from ../../constants/routes_constants import USER_ROUTE
from user_validator import validateIfUserExists, validateIfUserAlreadyExists
from user_serializer import getSerializedListOfUsers, getSerializedUser

proc getUsersFromDatabase*(): seq[UserEntity] =
  let httpClientImplementation = getHttpClientImplementationInstance()

  let requestResponse = httpClientImplementation.getContent(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/"))

  let unserializedListOfUsers = parseJson(requestResponse)

  return getSerializedListOfUsers(unserializedListOfUsers)


proc getUserFromDatabase*(id: int): UserEntity =
  let httpClientImplementation = getHttpClientImplementationInstance()

  let requestResponse =
    httpClientImplementation.get(fmt"{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/{id}/")

  let responseStatusCode = parseInt(requestResponse.status[0..2])

  validateIfUserExists(responseStatusCode)

  let unserializedUser = parseJson(requestResponse.body())

  return getSerializedUser(unserializedUser)

proc createUserOnDatabase*(user: UserEntity): void =
  let httpClientImplementation = getHttpClientImplementationInstance()

  let jsonOfUser = $(%*user)

  let requestResponse =
    httpClientImplementation.post(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/"), jsonOfUser)

  let responseStatusCode = parseInt(requestResponse.status[0..2])

  validateIfUserAlreadyExists(responseStatusCode)

proc updateUserOnDatabase*(user: UserEntity): void =
  let httpClientImplementation = getHttpClientImplementationInstance()

  let userId = user.id

  let jsonOfUser = $(%*user)

  let requestResponse =
    httpClientImplementation.patch(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/{userId}/"), jsonOfUser)

  let responseStatusCode = parseInt(requestResponse.status[0..2])

  validateIfUserExists(responseStatusCode)

proc deleteUserOnDatabase*(id: int): void =
  let httpClientImplementation = getHttpClientImplementationInstance()

  let requestResponse =
    httpClientImplementation.delete(fmt("{MESSAGE_QUEUE_SERVICE_URL}{USER_ROUTE}/{id}/"))

  let responseStatusCode = parseInt(requestResponse.status[0..2])

  validateIfUserExists(responseStatusCode)

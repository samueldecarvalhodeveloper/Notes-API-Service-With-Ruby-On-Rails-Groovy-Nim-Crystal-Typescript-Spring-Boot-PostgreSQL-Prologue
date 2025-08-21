import json
from infrastructure/entities/user_entity import UserEntity
from ../../constants/domains/user_constants import
  USER_ID_KEY,
  USER_USERNAME_KEY

proc getSerializedListOfUsers*(unserializedListOfUsers: JsonNode): seq[UserEntity] =
  var listOfUsers: seq[UserEntity] = @[]

  for user in unserializedListOfUsers:
    let serializedUser = UserEntity(
      id: user[USER_ID_KEY].getInt(),
      username: user[USER_USERNAME_KEY].getStr()
    )

    listOfUsers.add(serializedUser)

  return listOfUsers

proc getSerializedUser*(unserializedUser: JsonNode): UserEntity =
  return UserEntity(
    id: unserializedUser[USER_ID_KEY].getInt(),
    username: unserializedUser[USER_USERNAME_KEY].getStr()
  )

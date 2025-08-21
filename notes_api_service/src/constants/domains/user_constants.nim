import json
from ../../domains/user/infrastructure/entities/user_entity import UserEntity

const USER_ID_KEY* = "id"

const USER_USERNAME_KEY* = "username"

const NOT_EXISTING_USER_EXCEPTION_MESSAGE*: string = "User Does Not Exist!"

const ALREADY_EXISTING_USER_EXCEPTION_MESSAGE*: string = "User Already Exists!"

const USER_ID* = 0

const USER_USERNAME* = "Samuel de Carvalho"

let USER_JSON* = %*{ USER_USERNAME_KEY: USER_USERNAME }

let USER_DATA_TRANSFER_OBJECT_JSON* = %*{ USER_ID_KEY: USER_ID, USER_USERNAME_KEY: USER_USERNAME }

let LIST_USER_DATA_TRANSFER_OBJECT_JSON* = %*[{ USER_ID_KEY: USER_ID, USER_USERNAME_KEY: USER_USERNAME }]

let LIST_OF_USERS_JSON* = %*[{ USER_USERNAME_KEY: USER_USERNAME }]

let USER_JSON_WITH_WRONG_DATA* = %*{ USER_USERNAME_KEY: "Other Username" }

let USER_OBJECT* = UserEntity(id: USER_ID, username: USER_USERNAME)

let USER_OBJECT_WITH_WRONG_DATA* = UserEntity(id: USER_ID, username: "Other Username")

let MOST_USER_ID* = 999999999

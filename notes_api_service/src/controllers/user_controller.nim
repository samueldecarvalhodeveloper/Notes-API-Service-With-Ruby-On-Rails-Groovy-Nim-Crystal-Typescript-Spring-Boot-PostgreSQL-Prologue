import prologue
import json
import strutils
import random
from ../domains/user/user_repository import getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser
from ../domains/user/infrastructure/entities/user_entity import UserEntity
from ../constants/domains/user_constants import
  USER_ID_KEY,
  USER_USERNAME_KEY,
  NOT_EXISTING_USER_EXCEPTION_MESSAGE,
  MOST_USER_ID
from ../constants/server_constants import JSON_MESSAGE_KEY

proc getAllUsers*(ctx: Context) {.async.} =
  let users = %*getUsers()

  resp(jsonResponse(users, Http200))

proc getUser*(ctx: Context) {.async.} =
  try:
    let userId = parseInt(ctx.getPathParamsOption(USER_ID_KEY).get())

    let user = %*getUser(userId)

    resp(jsonResponse(user, Http200))
  except Exception:
    resp(jsonResponse(%*{ JSON_MESSAGE_KEY: NOT_EXISTING_USER_EXCEPTION_MESSAGE }, Http404))


proc createUser*(ctx: Context) {.async.} =
  var isUserCreated = false

  while not isUserCreated:
    try:
      let requestBody = parseJson(ctx.request.body())

      let userId = rand(MOST_USER_ID)
      let userUsername = requestBody[USER_USERNAME_KEY].getStr()

      let user = UserEntity(id: userId, username: userUsername)

      createUser(user)

      isUserCreated = true

      resp(jsonResponse(%*user, Http201))
    except Exception:
      discard()

proc updateUser*(ctx: Context) {.async.} =
  try:
    let requestBody = parseJson(ctx.request.body())

    let userId = parseInt(ctx.getPathParamsOption(USER_ID_KEY).get())
    let userUsername = requestBody[USER_USERNAME_KEY].getStr()

    let user = UserEntity(id: userId, username: userUsername)

    updateUser(user)

    resp(jsonResponse(%*user, Http200))
  except Exception:
    resp(jsonResponse(%*{ JSON_MESSAGE_KEY: NOT_EXISTING_USER_EXCEPTION_MESSAGE }, Http404))

proc deleteUser*(ctx: Context) {.async.} =
  try:
    let userId = parseInt(ctx.getPathParamsOption(USER_ID_KEY).get())

    deleteUser(userId)

    ctx.response.code = Http204
  except Exception:
    resp(jsonResponse(%*{ JSON_MESSAGE_KEY: NOT_EXISTING_USER_EXCEPTION_MESSAGE }, Http404))

import prologue
import json
import strutils
import random
import times
from ../domains/note/note_repository import
  getNote,
  getNotes,
  createNote,
  updateNote,
  deleteNote
from ../domains/note/infrastructure/entities/note_entity import
  NoteEntity
from ../constants/domains/note_constants import
  NOTE_ID_KEY,
  NOTE_TITLE_KEY,
  NOTE_BODY_KEY,
  NOTE_CREATED_AT_KEY,
  NOTE_UPDATED_AT_KEY,
  NOTE_USER_ID_KEY,
  NOT_EXISTING_NOTE_EXCEPTION_MESSAGE,
  ALREADY_EXISTING_NOTE_EXCEPTION_MESSAGE,
  MOST_NOTE_ID
from ../constants/server_constants import
  JSON_MESSAGE_KEY
from ../constants/domains/user_constants import
  NOT_EXISTING_USER_EXCEPTION_MESSAGE
from ../domains/user/infrastructure/exceptions/not_existing_user_exception import
  NotExistingUserException
from ../domains/note/infrastructure/exceptions/already_existing_note_exception import
  AlreadyExistingNoteException

proc getAllNotes*(ctx: Context) {.async.} =
  try:
    let userId = parseInt(ctx.getPathParamsOption(NOTE_USER_ID_KEY).get())

    let notes = %*getNotes(userId)

    resp(jsonResponse(notes, Http200))
  except Exception:
    resp(jsonResponse(%*{ JSON_MESSAGE_KEY: NOT_EXISTING_USER_EXCEPTION_MESSAGE }, Http404))


proc getNote*(ctx: Context) {.async.} =
  try:
    let id = parseInt(ctx.getPathParamsOption(NOTE_ID_KEY).get())
    let userId = parseInt(ctx.getPathParamsOption(NOTE_USER_ID_KEY).get())

    let note = %*getNote(id, userId)

    resp(jsonResponse(note, Http200))
  except Exception:
    resp(jsonResponse(%*{ JSON_MESSAGE_KEY: NOT_EXISTING_NOTE_EXCEPTION_MESSAGE }, Http404))

proc createNote*(ctx: Context) {.async.} =
  var isNoteCreated = false
  var isUserNotFound = false

  while (not isNoteCreated) and (not isUserNotFound):
    try:
      let requestBody = parseJson(ctx.request.body())

      let id = rand(MOST_NOTE_ID)
      let title = requestBody[NOTE_TITLE_KEY].getStr()
      let body = requestBody[NOTE_BODY_KEY].getStr()
      let createdAt = toUnix(now().toTime())
      let updatedAt = toUnix(now().toTime())
      let userId = parseInt(ctx.getPathParamsOption(NOTE_USER_ID_KEY).get())

      let note = NoteEntity(
        id: id,
        title: title,
        body: body,
        createdAt: createdAt,
        updatedAt: updatedAt,
        userId: userId
      )

      createNote(note)

      isNoteCreated = true

      resp(jsonResponse(%*note, Http201))
    except AlreadyExistingNoteException:
      discard()
    except NotExistingUserException:
      isUserNotFound = true

      resp(jsonResponse(%*{ JSON_MESSAGE_KEY: NOT_EXISTING_USER_EXCEPTION_MESSAGE }, Http404))

proc updateNote*(ctx: Context) {.async.} =
  try:
    let requestBody = parseJson(ctx.request.body())

    let id = parseInt(ctx.getPathParamsOption(NOTE_ID_KEY).get())
    let userId = parseInt(ctx.getPathParamsOption(NOTE_USER_ID_KEY).get())

    let noteWithOldContent = getNote(id, userId)

    let title = requestBody[NOTE_TITLE_KEY].getStr()
    let body = requestBody[NOTE_BODY_KEY].getStr()
    let createdAt = noteWithOldContent.createdAt
    let updatedAt = toUnix(now().toTime())

    let note = NoteEntity(
      id: id,
      title: title,
      body: body,
      createdAt: createdAt,
      updatedAt: updatedAt,
      userId: userId
    )

    updateNote(note)

    resp(jsonResponse(%*note, Http200))
  except Exception:
    resp(jsonResponse(%*{ JSON_MESSAGE_KEY: NOT_EXISTING_NOTE_EXCEPTION_MESSAGE }, Http404))

proc deleteNote*(ctx: Context) {.async.} =
  try:
    let id = parseInt(ctx.getPathParamsOption(NOTE_ID_KEY).get())
    let userId = parseInt(ctx.getPathParamsOption(NOTE_USER_ID_KEY).get())

    deleteNote(id, userId)

    ctx.response.code = Http204
  except Exception:
    resp(jsonResponse(%*{ JSON_MESSAGE_KEY: NOT_EXISTING_NOTE_EXCEPTION_MESSAGE }, Http404))

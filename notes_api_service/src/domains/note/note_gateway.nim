import strformat
import httpclient
import json
import strutils
from infrastructure/entities/note_entity import NoteEntity
from ../../infrastructure/concerns/http_client_implementation_factory import
  getHttpClientImplementationInstance
from ../../constants/server_constants import MESSAGE_QUEUE_SERVICE_URL
from ../../constants/routes_constants import NOTE_ROUTE
from ../user/user_validator import validateIfUserExists
from note_validator import validateIfNoteExists, validateIfNoteAlreadyExists
from note_serializer import getSerializedListOfNotes, getSerializedNote

proc getNotesFromDatabase*(userId: int): seq[NoteEntity] =
  let httpClientImplementation = getHttpClientImplementationInstance()

  let requestResponse = httpClientImplementation.get(fmt("{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{userId}/"))

  let responseStatusCode = parseInt(requestResponse.status[0..2])

  validateIfUserExists(responseStatusCode)

  let unserializedListOfNotes = parseJson(requestResponse.body())

  return getSerializedListOfNotes(unserializedListOfNotes)

proc getNoteFromDatabase*(id: int, userId: int): NoteEntity =
  let httpClientImplementation = getHttpClientImplementationInstance()

  let requestResponse =
    httpClientImplementation.get(fmt"{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{userId}/{id}/")

  let responseStatusCode = parseInt(requestResponse.status[0..2])

  validateIfNoteExists(responseStatusCode)

  let unserializedNote = parseJson(requestResponse.body())

  return getSerializedNote(unserializedNote)

proc createNoteOnDatabase*(note: NoteEntity): void =
  let httpClientImplementation = getHttpClientImplementationInstance()

  let userId = note.userId

  let jsonOfNote = $(%*note)

  let requestResponse =
    httpClientImplementation.post(fmt("{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{userId}/"), jsonOfNote)

  let responseStatusCode = parseInt(requestResponse.status[0..2])

  validateIfUserExists(responseStatusCode)

  validateIfNoteAlreadyExists(responseStatusCode)

proc updateNoteOnDatabase*(note: NoteEntity): void =
  let httpClientImplementation = getHttpClientImplementationInstance()

  let userId = note.userId
  let noteId = note.id

  let jsonOfNote = $(%*note)

  let requestResponse =
    httpClientImplementation.patch(fmt("{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{userId}/{noteId}/"), jsonOfNote)

  let responseStatusCode = parseInt(requestResponse.status[0..2])

  validateIfNoteExists(responseStatusCode)

proc deleteNoteOnDatabase*(id: int, userId: int): void =
  let httpClientImplementation = getHttpClientImplementationInstance()

  let requestResponse =
    httpClientImplementation.delete(fmt("{MESSAGE_QUEUE_SERVICE_URL}{NOTE_ROUTE}/{userId}/{id}/"))

  let responseStatusCode = parseInt(requestResponse.status[0..2])

  validateIfNoteExists(responseStatusCode)

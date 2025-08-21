import json
from infrastructure/entities/note_entity import NoteEntity
from ../../constants/domains/note_constants import
  NOTE_ID_KEY,
  NOTE_TITLE_KEY,
  NOTE_BODY_KEY,
  NOTE_CREATED_AT_KEY,
  NOTE_UPDATED_AT_KEY,
  NOTE_USER_ID_KEY

proc getSerializedListOfNotes*(unserializedListOfNotes: JsonNode): seq[NoteEntity] =
  var listOfNotes: seq[NoteEntity] = @[]

  for note in unserializedListOfNotes:
    let serializedNote = NoteEntity(
      id: note[NOTE_ID_KEY].getInt(),
      title: note[NOTE_TITLE_KEY].getStr(),
      body: note[NOTE_BODY_KEY].getStr(),
      createdAt: note[NOTE_CREATED_AT_KEY].getInt(),
      updatedAt: note[NOTE_UPDATED_AT_KEY].getInt(),
      userId: note[NOTE_USER_ID_KEY].getInt()
    )

    listOfNotes.add(serializedNote)

  return listOfNotes

proc getSerializedNote*(unserializedNote: JsonNode): NoteEntity =
  return NoteEntity(
    id: unserializedNote[NOTE_ID_KEY].getInt(),
    title: unserializedNote[NOTE_TITLE_KEY].getStr(),
    body: unserializedNote[NOTE_BODY_KEY].getStr(),
    createdAt: unserializedNote[NOTE_CREATED_AT_KEY].getInt(),
    updatedAt: unserializedNote[NOTE_UPDATED_AT_KEY].getInt(),
    userId: unserializedNote[NOTE_USER_ID_KEY].getInt()
  )

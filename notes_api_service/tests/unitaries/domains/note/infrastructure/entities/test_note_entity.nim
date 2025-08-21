import unittest2
from ../../../../../../src/domains/note/infrastructure/entities/note_entity import NoteEntity
from ../../../../../../src/constants/domains/note_constants import
  NOTE_ID,
  NOTE_TITLE,
  NOTE_BODY,
  NOTE_CREATED_AT,
  NOTE_UPDATED_AT,
  WRONG_NOTE_TITLE
from ../../../../../../src/constants/domains/user_constants import
  USER_ID

suite "Test Module \"Note Entity\" Behavior":
  test "Test If Entity Describes How Note Is Used By The System":
    let note = NoteEntity(id: NOTE_ID, title: NOTE_TITLE, body: NOTE_BODY, createdAt: NOTE_CREATED_AT, updatedAt: NOTE_UPDATED_AT, userId: USER_ID)

    check(note.id == NOTE_ID)
    check(note.title == NOTE_TITLE)
    check(note.body == NOTE_BODY)
    check(note.createdAt == NOTE_CREATED_AT)
    check(note.updatedAt == NOTE_UPDATED_AT)
    check(note.userId == USER_ID)

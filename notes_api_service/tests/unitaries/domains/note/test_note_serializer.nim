import unittest2
import json
from ../../../../src/domains/note/note_serializer import
  getSerializedListOfNotes,
  getSerializedNote
from ../../../../src/constants/domains/note_constants import
  NOTE_DATA_TRANSFER_OBJECT_JSON,
  LIST_OF_NOTE_DATA_TRANSFER_OBJECT_JSON

suite "Test Module \"Note Serializer\" Behavior":
  test "Test If Function \"getSerializedListOfNotes\" Returns List Of Note Entities":
    let listOfNotes = getSerializedListOfNotes(LIST_OF_NOTE_DATA_TRANSFER_OBJECT_JSON)

    check(%*listOfNotes == LIST_OF_NOTE_DATA_TRANSFER_OBJECT_JSON)

  test "Test If Function \"getSerializedNote\" Returns Note Entities":
    let note = getSerializedNote(NOTE_DATA_TRANSFER_OBJECT_JSON)

    check(%*note == NOTE_DATA_TRANSFER_OBJECT_JSON)

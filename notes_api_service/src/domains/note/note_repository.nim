from ./infrastructure/entities/note_entity import NoteEntity
from ./note_gateway import
  getNotesFromDatabase,
  getNoteFromDatabase,
  createNoteOnDatabase,
  updateNoteOnDatabase,
  deleteNoteOnDatabase

proc getNotes*(userId: int): seq[NoteEntity] =
  return getNotesFromDatabase(userId)

proc getNote*(id: int, userId: int): NoteEntity =
  return getNoteFromDatabase(id, userId)

proc createNote*(note: NoteEntity): void =
  createNoteOnDatabase(note)

proc updateNote*(note: NoteEntity): void =
  updateNoteOnDatabase(note)

proc deleteNote*(id: int, userId: int): void =
  deleteNoteOnDatabase(id, userId)

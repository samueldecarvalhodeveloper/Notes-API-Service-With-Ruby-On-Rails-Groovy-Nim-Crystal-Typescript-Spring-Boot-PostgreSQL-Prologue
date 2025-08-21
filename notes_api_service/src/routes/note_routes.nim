import prologue
from ../constants/routes_constants import NOTE_ROUTE, NOTE_ROUTE_BY_USER_ID, NOTE_ROUTE_BY_NOTE_ID
from ../controllers/note_controller import getAllNotes, getNote, createNote, updateNote, deleteNote

proc createNoteRoutes*(app: Prologue) =
  var noteRouteGroup = newGroup(app, NOTE_ROUTE, @[])

  noteRouteGroup.get(NOTE_ROUTE_BY_USER_ID, getAllNotes)
  noteRouteGroup.get(NOTE_ROUTE_BY_NOTE_ID, getNote)
  noteRouteGroup.post(NOTE_ROUTE_BY_USER_ID, createNote)
  noteRouteGroup.patch(NOTE_ROUTE_BY_NOTE_ID, updateNote)
  noteRouteGroup.delete(NOTE_ROUTE_BY_NOTE_ID, deleteNote)

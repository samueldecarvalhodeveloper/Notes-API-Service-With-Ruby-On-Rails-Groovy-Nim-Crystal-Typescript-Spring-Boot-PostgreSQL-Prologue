import prologue
from ../constants/server_constants import SERVER_PORT
from ../routes/error_routes import createErrorRoutes
from ../routes/user_routes import createUserRoutes
from ../routes/note_routes import createNoteRoutes

let serverSettings = newSettings(port = SERVER_PORT)
let app* = newApp(serverSettings, errorHandlerTable = newErrorHandlerTable())

createErrorRoutes(app)
createUserRoutes(app)
createNoteRoutes(app)

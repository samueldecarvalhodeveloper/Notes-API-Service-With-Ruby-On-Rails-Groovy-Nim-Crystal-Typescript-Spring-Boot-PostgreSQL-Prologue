import prologue
from ../controllers/error_controller import handleNotErrorFound

proc createErrorRoutes*(app: Prologue) =
  app.registerErrorHandler(Http404, handleNotErrorFound)

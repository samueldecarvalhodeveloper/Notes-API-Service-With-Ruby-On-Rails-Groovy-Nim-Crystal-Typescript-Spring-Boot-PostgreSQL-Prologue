import prologue
import json
from ../constants/server_constants import
  JSON_MESSAGE_KEY,
  NOT_FOUND_ERROR_MESSAGE

proc handleNotErrorFound*(ctx: Context) {.async.} =
  resp(jsonResponse(%*{ JSON_MESSAGE_KEY: NOT_FOUND_ERROR_MESSAGE }, Http404))

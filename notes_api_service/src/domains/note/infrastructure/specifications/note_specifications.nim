import httpcore

proc isNoteNotExisting*(responseStatusCode: int): bool =
  return HttpCode(responseStatusCode) == Http404

proc isNoteAlreadyExisting*(responseStatusCode: int): bool =
  return HttpCode(responseStatusCode) == HTTP409

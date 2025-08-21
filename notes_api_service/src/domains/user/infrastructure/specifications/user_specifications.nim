import httpcore

proc isUserNotExisting*(responseStatusCode: int): bool =
  return HttpCode(responseStatusCode) == Http404

proc isUserAlreadyExisting*(responseStatusCode: int): bool =
  return HttpCode(responseStatusCode) == HTTP409

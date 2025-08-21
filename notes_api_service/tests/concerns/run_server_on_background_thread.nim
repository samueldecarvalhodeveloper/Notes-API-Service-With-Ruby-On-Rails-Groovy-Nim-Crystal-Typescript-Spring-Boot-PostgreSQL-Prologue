import prologue
from ../../src/server/server import app

proc runServerOnBackgroundThread*(): void =
  discard(app.runAsync())

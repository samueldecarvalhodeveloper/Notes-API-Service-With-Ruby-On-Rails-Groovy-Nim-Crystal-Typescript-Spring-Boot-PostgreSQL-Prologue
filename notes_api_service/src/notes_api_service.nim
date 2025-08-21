import prologue
from server/server import app

proc main =
  app.run()

when isMainModule:
  main()

import httpclient
from ../../constants/application_constants import
  HTTP_CLIENT_CONTENT_TYPE_HEADER_KEY,
  HTTP_CLIENT_CONTENT_TYPE_HEADER_VALUE

proc getHttpClientImplementationInstance*(): HttpClient =
  let instance = newHttpClient()

  instance.headers = newHttpHeaders({ HTTP_CLIENT_CONTENT_TYPE_HEADER_KEY: HTTP_CLIENT_CONTENT_TYPE_HEADER_VALUE })

  return instance

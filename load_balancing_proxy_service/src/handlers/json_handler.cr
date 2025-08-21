require "grip"
require "../constants/server_constants"

class JsonHandler
  include HTTP::Handler

  def call(context : HTTP::Server::Context) : HTTP::Server::Context
    context.put_resp_header(CONTENT_TYPE_HEADER_KEY, JSON_CONTENT_TYPE_HEADER_VALUE)
  end
end

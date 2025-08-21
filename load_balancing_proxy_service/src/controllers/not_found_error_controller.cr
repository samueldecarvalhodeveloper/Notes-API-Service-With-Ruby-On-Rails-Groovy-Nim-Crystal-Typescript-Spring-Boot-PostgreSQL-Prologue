require "grip"
require "../constants/server_constants"

class NotFoundErrorController < Grip::Controllers::Exception
  def call(context : Context) : Context
    context
      .json({
          JSON_MESSAGE_KEY => NOT_FOUND_ERROR_MESSAGE
        })
  end
end

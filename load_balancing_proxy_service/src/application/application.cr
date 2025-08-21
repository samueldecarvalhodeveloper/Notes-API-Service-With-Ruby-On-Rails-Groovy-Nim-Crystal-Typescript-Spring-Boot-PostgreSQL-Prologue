require "grip"
require "../constants/application_constants"
require "../constants/routes_constants"
require "../handlers/json_handler"
require "../controllers/not_found_error_controller"
require "../controllers/user_controller"
require "../controllers/note_controller"

class Application < Grip::Application
  def port : Int32
    PORT
  end

  def initialize
    super(environment: ENVIRONMENT)

    exception Grip::Exceptions::NotFound, NotFoundErrorController

    pipeline :json, [
      JsonHandler.new
    ]

    pipe_through :json

    get USER_ROUTE, UserController, as: get_all_users
    get SPECIFIC_USER_ROUTE, UserController, as: get_user
    post USER_ROUTE, UserController, as: create_user
    patch SPECIFIC_USER_ROUTE, UserController, as: update_user
    delete SPECIFIC_USER_ROUTE, UserController, as: delete_user

    get NOTE_ROUTE, NoteController, as: get_all_notes
    get SPECIFIC_NOTE_ROUTE, NoteController, as: get_note
    post NOTE_ROUTE, NoteController, as: create_note
    patch SPECIFIC_NOTE_ROUTE, NoteController, as: update_note
    delete SPECIFIC_NOTE_ROUTE, NoteController, as: delete_note
  end
end

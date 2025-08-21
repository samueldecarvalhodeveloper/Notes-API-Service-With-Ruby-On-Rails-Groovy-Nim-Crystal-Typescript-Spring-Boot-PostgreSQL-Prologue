Rails.application.routes.draw do
  get "/users/", to: "user#get_all_users"
  get "/users/:id/", to: "user#get_user"
  post "/users/", to: "user#create_user"
  patch "/users/:id/", to: "user#update_user"
  delete "/users/:id/", to: "user#delete_user"

  get "/notes/:id/", to: "note#get_all_notes"
  get "/notes/:id/:note_id/", to: "note#get_note"
  post "/notes/:id/", to: "note#create_note"
  patch "/notes/:id/:note_id/", to: "note#update_note"
  delete "/notes/:id/:note_id/", to: "note#delete_note"
end

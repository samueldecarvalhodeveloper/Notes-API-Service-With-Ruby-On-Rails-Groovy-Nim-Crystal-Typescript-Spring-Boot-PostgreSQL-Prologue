USER_ID = 10

USER_USERNAME = "Samuel de Carvalho"

USER_JSON = { "id" => USER_ID, "username" => USER_USERNAME }.to_json

USER_WITH_WRONG_DATA_JSON = { "id" => USER_ID, "username" => USER_USERNAME }.to_json

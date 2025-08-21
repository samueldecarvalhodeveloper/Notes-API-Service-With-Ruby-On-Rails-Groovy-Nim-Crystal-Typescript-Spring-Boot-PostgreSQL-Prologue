require "http/client"
require "./infrastructure/entities/response_entity"
require "./update_current_host_adapter"
require "../../constants/application_constants"
require "../../constants/server_constants"

class RequestRedirector
  @@list_of_host_names = LIST_OF_HOST_NAMES
  @@current_host_index = 0

  def self.get_response_of_get_redirect(route : String) : ResponseEntity
    response = HTTP::Client.get url: "#{@@list_of_host_names[@@current_host_index]}#{route}"

    @@current_host_index = UpdateCurrentHostAdapter.get_updated_host_index(@@current_host_index)

    ResponseEntity.new body: response.body, status_code: response.status_code
  end

  def self.get_response_of_post_redirect(route : String, body : String) : ResponseEntity
    response = HTTP::Client.post(
      url: "#{@@list_of_host_names[@@current_host_index]}#{route}",
      body: body,
      headers: HTTP::Headers{CONTENT_TYPE_HEADER_KEY => JSON_CONTENT_TYPE_HEADER_VALUE}
    )

    @@current_host_index = UpdateCurrentHostAdapter.get_updated_host_index(@@current_host_index)

    ResponseEntity.new body: response.body, status_code: response.status_code
  end

  def self.get_response_of_patch_redirect(route : String, body : String) : ResponseEntity
    response = HTTP::Client.patch(
      url: "#{@@list_of_host_names[@@current_host_index]}#{route}",
      body: body,
      headers: HTTP::Headers{CONTENT_TYPE_HEADER_KEY => JSON_CONTENT_TYPE_HEADER_VALUE}
    )

    @@current_host_index = UpdateCurrentHostAdapter.get_updated_host_index(@@current_host_index)

    ResponseEntity.new body: response.body, status_code: response.status_code
  end

  def self.get_response_of_delete_redirect(route : String) : ResponseEntity
    response = HTTP::Client.delete("#{@@list_of_host_names[@@current_host_index]}#{route}")

    @@current_host_index = UpdateCurrentHostAdapter.get_updated_host_index(@@current_host_index)

    ResponseEntity.new body: response.body, status_code: response.status_code
  end
end

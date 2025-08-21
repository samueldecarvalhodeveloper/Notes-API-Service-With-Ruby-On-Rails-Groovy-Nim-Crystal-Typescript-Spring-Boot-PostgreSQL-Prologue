require "../../../spec_helper"

describe RequestRedirector do
  before_each do
    HTTP::Client.delete "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}#{USER_ID}/"
  end

  it "Test If Method \"get_response_of_get_redirect\" Returns Get Request Response Of Current Server" do
    response_body_of_server = HTTP::Client.get "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}"

    response = RequestRedirector.get_response_of_get_redirect USER_ROUTE

    response.body.should eq response_body_of_server.body
    response.status_code.should eq HTTP::Status::OK.value
  end

  it "Test If Method \"get_response_of_post_redirect\" Returns Post Request Response Of Current Server" do
    response =
      RequestRedirector.get_response_of_post_redirect USER_ROUTE, USER_JSON

    response.status_code.should eq HTTP::Status::CREATED.value
    response.body.should eq USER_JSON
  end

  it "Test If Method \"get_response_of_patch_redirect\" Returns Patch Request Response Of Current Server" do
    response_body_of_server =
      HTTP::Client.patch "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}#{USER_ID}/", nil, ""

    response =
      RequestRedirector.get_response_of_patch_redirect "#{USER_ROUTE}#{USER_ID}/", ""

    response.status_code.should eq response_body_of_server.status_code
    response.body.should eq response_body_of_server.body
  end

  it "Test If Method \"get_response_of_delete_redirect\" Returns Delete Request Response Of Current Server" do
    response_body_of_server =
      HTTP::Client.delete "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}#{USER_ID}/"

    response =
      RequestRedirector.get_response_of_delete_redirect "#{USER_ROUTE}#{USER_ID}/"

    response.status_code.should eq response_body_of_server.status_code
  end
end

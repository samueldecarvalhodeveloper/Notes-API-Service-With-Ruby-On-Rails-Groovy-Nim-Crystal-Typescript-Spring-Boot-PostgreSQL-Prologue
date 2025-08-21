require "../spec_helper"

describe "Test Component \"RequestRedirector\" Behavior" do
  before_each do
    HTTP::Client.delete "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}#{USER_ID}/"
  end

  it "Test Redirecting Get Request" do
    response_body_of_server = HTTP::Client.get "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}/"

    response = RequestRedirector.get_response_of_get_redirect USER_ROUTE

    response.body.should eq response_body_of_server.body
    response.status_code.should eq HTTP::Status::OK.value
  end

  it "Test Redirecting Post Request" do
    response =
      RequestRedirector.get_response_of_post_redirect USER_ROUTE, USER_JSON

    response.status_code.should eq HTTP::Status::CREATED.value
    response.body.should eq USER_JSON
  end

  it "Test Redirecting Patch Request" do
    response_body_of_server =
      HTTP::Client.patch "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}#{USER_ID}/", nil, ""

    response =
      RequestRedirector.get_response_of_patch_redirect "#{USER_ROUTE}#{USER_ID}/", ""

    response.status_code.should eq response_body_of_server.status_code
    response.body.should eq response_body_of_server.body
  end

  it "Test Redirecting Delete Request" do
    response_body_of_server =
      HTTP::Client.delete "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}#{USER_ID}/"

    response =
      RequestRedirector.get_response_of_delete_redirect "#{USER_ROUTE}#{USER_ID}/"

    response.status_code.should eq response_body_of_server.status_code
  end
end

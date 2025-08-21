require "../../spec_helper"

describe Application do
  it "Test If Not Found Exception Is Set" do
    response = get Application.new, INDEX_ROUTE

    response.body.should eq NOT_FOUND_ERROR_MESSAGE_JSON
  end

  it "Test If Json Pipeline Adds Json Application Content type To Response Header" do
    response = get Application.new, INDEX_ROUTE

    response.headers[CONTENT_TYPE_HEADER_KEY].should eq JSON_CONTENT_TYPE_HEADER_VALUE
  end

  it "Test If User Index Route Redirects Request" do
    response_from_server = HTTP::Client.get "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}"

    response_from_load_balance_server = get Application.new, "#{USER_ROUTE}"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If User Specific Route Redirects Request" do
    response_from_server = HTTP::Client.get "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}#{USER_ID}/"

    response_from_load_balance_server = get Application.new, "#{USER_ROUTE}#{USER_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If User Creation Route Redirects Request" do
    response_from_server = HTTP::Client.post "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}"

    response_from_load_balance_server = post Application.new, "#{USER_ROUTE}"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If User Updating Route Redirects Request" do
    response_from_server = HTTP::Client.patch "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}#{USER_ID}/"

    response_from_load_balance_server = patch Application.new, "#{USER_ROUTE}#{USER_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If User Deletion Route Redirects Request" do
    response_from_server = HTTP::Client.delete "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}#{USER_ID}/"

    response_from_load_balance_server = delete Application.new, "#{USER_ROUTE}#{USER_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If User's Notes Route Redirects Request" do
    response_from_server = HTTP::Client.get "#{LIST_OF_HOST_NAMES[0]}#{NOTE_ROUTE}#{USER_ID}/"

    response_from_load_balance_server = get Application.new, "#{NOTE_ROUTE}#{USER_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If Note Specific Route Redirects Request" do
    response_from_server = HTTP::Client.get "#{LIST_OF_HOST_NAMES[0]}#{NOTE_ROUTE}#{USER_ID}/#{NOTE_ID}/"

    response_from_load_balance_server = get Application.new, "#{NOTE_ROUTE}#{USER_ID}/#{NOTE_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If Note Creation Route Redirects Request" do
    response_from_server = HTTP::Client.post "#{LIST_OF_HOST_NAMES[0]}#{NOTE_ROUTE}#{USER_ID}/"

    response_from_load_balance_server = post Application.new, "#{NOTE_ROUTE}#{USER_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If Note Updating Route Redirects Request" do
    response_from_server = HTTP::Client.patch "#{LIST_OF_HOST_NAMES[0]}#{NOTE_ROUTE}#{USER_ID}/#{NOTE_ID}/"

    response_from_load_balance_server = patch Application.new, "#{NOTE_ROUTE}#{USER_ID}/#{NOTE_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If Note Deletion Route Redirects Request" do
    response_from_server = HTTP::Client.delete "#{LIST_OF_HOST_NAMES[0]}#{NOTE_ROUTE}#{USER_ID}/#{NOTE_ID}/"

    response_from_load_balance_server = delete Application.new, "#{NOTE_ROUTE}#{USER_ID}/#{NOTE_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end
end

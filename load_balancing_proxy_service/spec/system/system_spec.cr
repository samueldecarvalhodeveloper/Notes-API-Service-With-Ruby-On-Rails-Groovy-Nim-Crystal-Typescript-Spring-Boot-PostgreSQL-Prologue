require "../spec_helper"

describe "Test System Behavior" do
  it "Test Redirecting User Index Request" do
    response_from_server = HTTP::Client.get "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}"

    response_from_load_balance_server = get Application.new, "#{USER_ROUTE}"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test Redirecting User Specific Request" do
    response_from_server = HTTP::Client.get "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}#{USER_ID}/"

    response_from_load_balance_server = get Application.new, "#{USER_ROUTE}#{USER_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test Redirecting User Creation Request" do
    response_from_server = HTTP::Client.post "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}"

    response_from_load_balance_server = post Application.new, "#{USER_ROUTE}"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test Redirecting User Updating Request" do
    response_from_server = HTTP::Client.patch "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}#{USER_ID}/"

    response_from_load_balance_server = patch Application.new, "#{USER_ROUTE}#{USER_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If Redirecting User Deletion Request" do
    response_from_server = HTTP::Client.delete "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}#{USER_ID}/"

    response_from_load_balance_server = delete Application.new, "#{USER_ROUTE}#{USER_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If Redirecting User's Notes Request" do
    response_from_server = HTTP::Client.get "#{LIST_OF_HOST_NAMES[0]}#{NOTE_ROUTE}#{USER_ID}/"

    response_from_load_balance_server = get Application.new, "#{NOTE_ROUTE}#{USER_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If Redirecting Note Specific Request" do
    response_from_server = HTTP::Client.get "#{LIST_OF_HOST_NAMES[0]}#{NOTE_ROUTE}#{USER_ID}/#{NOTE_ID}/"

    response_from_load_balance_server = get Application.new, "#{NOTE_ROUTE}#{USER_ID}/#{NOTE_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If Redirecting Note Creation Request" do
    response_from_server = HTTP::Client.post "#{LIST_OF_HOST_NAMES[0]}#{NOTE_ROUTE}#{USER_ID}/"

    response_from_load_balance_server = post Application.new, "#{NOTE_ROUTE}#{USER_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If Redirecting Note Updating Request" do
    response_from_server = HTTP::Client.patch "#{LIST_OF_HOST_NAMES[0]}#{NOTE_ROUTE}#{USER_ID}/#{NOTE_ID}/"

    response_from_load_balance_server = patch Application.new, "#{NOTE_ROUTE}#{USER_ID}/#{NOTE_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If Redirecting Note Deletion Request" do
    response_from_server = HTTP::Client.delete "#{LIST_OF_HOST_NAMES[0]}#{NOTE_ROUTE}#{USER_ID}/#{NOTE_ID}/"

    response_from_load_balance_server = delete Application.new, "#{NOTE_ROUTE}#{USER_ID}/#{NOTE_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end
end

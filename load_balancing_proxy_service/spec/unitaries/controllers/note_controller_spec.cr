require "../../spec_helper"

describe NoteController do
  it "Test If Method \"get_all_notes\" Redirects The Response To Its Route On Server And Responds Server Response To Client" do
    response_from_server = HTTP::Client.get "#{LIST_OF_HOST_NAMES[0]}#{NOTE_ROUTE}#{USER_ID}/"

    response_from_load_balance_server = get Application.new, "#{NOTE_ROUTE}#{USER_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If Method \"get_note\" Redirects The Response To Its Route On Server And Responds Server Response To Client" do
    response_from_server = HTTP::Client.get "#{LIST_OF_HOST_NAMES[0]}#{NOTE_ROUTE}#{USER_ID}/#{NOTE_ID}/"

    response_from_load_balance_server = get Application.new, "#{NOTE_ROUTE}#{USER_ID}/#{NOTE_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If Method \"create_note\" Redirects The Response To Its Route On Server And Responds Server Response To Client" do
    response_from_server = HTTP::Client.post "#{LIST_OF_HOST_NAMES[0]}#{NOTE_ROUTE}#{USER_ID}/"

    response_from_load_balance_server = post Application.new, "#{NOTE_ROUTE}#{USER_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If Method \"update_note\" Redirects The Response To Its Route On Server And Responds Server Response To Client" do
    response_from_server = HTTP::Client.patch "#{LIST_OF_HOST_NAMES[0]}#{NOTE_ROUTE}#{USER_ID}/#{NOTE_ID}/"

    response_from_load_balance_server = patch Application.new, "#{NOTE_ROUTE}#{USER_ID}/#{NOTE_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If Method \"delete_note\" Redirects The Response To Its Route On Server And Responds Server Response To Client" do
    response_from_server = HTTP::Client.delete "#{LIST_OF_HOST_NAMES[0]}#{NOTE_ROUTE}#{USER_ID}/#{NOTE_ID}/"

    response_from_load_balance_server = delete Application.new, "#{NOTE_ROUTE}#{USER_ID}/#{NOTE_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end
end

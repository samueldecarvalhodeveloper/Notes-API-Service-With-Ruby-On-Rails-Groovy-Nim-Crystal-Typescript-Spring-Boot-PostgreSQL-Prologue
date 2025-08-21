require "../../spec_helper"

describe UserController do
  it "Test If Method \"get_all_users\" Redirects The Response To Its Route On Server And Responds Server Response To Client" do
    response_from_server = HTTP::Client.get "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}"

    response_from_load_balance_server = get Application.new, "#{USER_ROUTE}"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If Method \"get_user\" Redirects The Response To Its Route On Server And Responds Server Response To Client" do
    response_from_server = HTTP::Client.get "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}#{USER_ID}/"

    response_from_load_balance_server = get Application.new, "#{USER_ROUTE}#{USER_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If Method \"create_user\" Redirects The Response To Its Route On Server And Responds Server Response To Client" do
    response_from_server = HTTP::Client.post "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}"

    response_from_load_balance_server = post Application.new, "#{USER_ROUTE}"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If Method \"update_user\" Redirects The Response To Its Route On Server And Responds Server Response To Client" do
    response_from_server = HTTP::Client.patch "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}#{USER_ID}/"

    response_from_load_balance_server = patch Application.new, "#{USER_ROUTE}#{USER_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end

  it "Test If Method \"delete_user\" Redirects The Response To Its Route On Server And Responds Server Response To Client" do
    response_from_server = HTTP::Client.delete "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}#{USER_ID}/"

    response_from_load_balance_server = delete Application.new, "#{USER_ROUTE}#{USER_ID}/"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end
end

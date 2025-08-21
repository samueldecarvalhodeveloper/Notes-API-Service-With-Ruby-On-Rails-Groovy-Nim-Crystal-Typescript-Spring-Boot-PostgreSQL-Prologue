require "../spec_helper"

describe "Test Integration of \"Server Redirecting Requests\" Behavior" do
  it "Test Load Balance Server Redirecting Request To Api" do
    response_from_server = HTTP::Client.get "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}"

    response_from_load_balance_server = get Application.new, "#{USER_ROUTE}"

    response_from_server.body.should eq response_from_load_balance_server.body
    response_from_server.status_code.should eq response_from_load_balance_server.status_code
  end
end

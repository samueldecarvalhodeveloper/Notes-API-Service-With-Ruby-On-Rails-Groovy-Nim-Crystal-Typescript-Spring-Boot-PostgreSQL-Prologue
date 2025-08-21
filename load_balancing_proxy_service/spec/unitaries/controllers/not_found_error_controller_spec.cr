require "../../spec_helper"

describe NotFoundErrorController do
  it "Test If Controller Responds Not Found Message To A Not Existing Route" do
    response = get Application.new, INDEX_ROUTE

    response.body.should eq NOT_FOUND_ERROR_MESSAGE_JSON
  end
end

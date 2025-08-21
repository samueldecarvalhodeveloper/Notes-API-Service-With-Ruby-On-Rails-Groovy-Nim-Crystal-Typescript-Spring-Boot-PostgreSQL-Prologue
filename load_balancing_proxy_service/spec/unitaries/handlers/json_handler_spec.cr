require "../../spec_helper"

describe JsonHandler do
  it "Test If Handler Adds Json Application Content type To Response Header" do
    response = get Application.new, INDEX_ROUTE

    response.headers[CONTENT_TYPE_HEADER_KEY].should eq JSON_CONTENT_TYPE_HEADER_VALUE
  end
end

require "../../../../../spec_helper"

describe ResponseEntity do
  it "Test If Entity Describes How Response Should Be Handled By The System" do
    request = HTTP::Client.get "#{LIST_OF_HOST_NAMES[0]}#{USER_ROUTE}"

    response = ResponseEntity.new request.body, request.status_code

    response.body.should eq request.body
    response.status_code.should eq request.status_code
  end
end

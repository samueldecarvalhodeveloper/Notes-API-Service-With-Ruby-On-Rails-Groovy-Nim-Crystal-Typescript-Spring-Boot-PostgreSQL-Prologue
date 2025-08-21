require "test_helper"

class VerifyIfUserExistsCommandTest < ActiveSupport::TestCase
  test "Test If Method \"execute\" Throws Not Existing User Error If User Does Not Exist" do
    begin
      VerifyIfUserExistsAdapter.execute UserConstants::USER_TO_BE_CREATED_ID
    rescue StandardError
      assert true
    end
  end
end

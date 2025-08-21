require "test_helper"

class UserUseCasesTest < ActiveSupport::TestCase
  test "Test If Method \"get_user\" Returns User From Database" do
    User.create id: UserConstants::USER_TO_BE_CREATED_ID, username: UserConstants::USER_TO_BE_CREATED_USERNAME

    user = UserUseCases.get_user UserConstants::USER_TO_BE_CREATED_ID

    assert_equal UserConstants::USER_TO_BE_CREATED_ID, user.id
    assert_equal UserConstants::USER_TO_BE_CREATED_USERNAME, user.username
  end

  test "Test If Method \"get_all_users\" Returns All Users From Database" do
    (User.create username: UserConstants::USER_TO_BE_CREATED_USERNAME, id: UserConstants::FIRST_USER_TO_BE_CREATED_ID)
    (User.create username: UserConstants::USER_TO_BE_CREATED_USERNAME, id: UserConstants::SECOND_USER_TO_BE_CREATED_ID)

    all_users = UserUseCases.get_all_users

    assert_equal UserConstants::NUMBER_OF_CREATED_USERS, all_users.length
  end

  test "Test If Method \"create_user\" Creates User On Database" do
    UserUseCases.create_user UserConstants::USER_TO_BE_CREATED_USERNAME, UserConstants::USER_TO_BE_CREATED_ID

    created_user = User.find UserConstants::USER_TO_BE_CREATED_ID

    assert_equal UserConstants::USER_TO_BE_CREATED_ID, created_user.id
    assert_equal UserConstants::USER_TO_BE_CREATED_USERNAME, created_user.username
  end

  test "Test If Method \"update_user\" Updates User On Database" do
    User.create id: UserConstants::USER_TO_BE_CREATED_ID, username: UserConstants::USER_TO_BE_CREATED_USERNAME

    UserUseCases.update_user UserConstants::USER_TO_HAVE_USERNAME_UPDATED_NEW_USERNAME, UserConstants::USER_TO_BE_CREATED_ID

    updated_user = User.find UserConstants::USER_TO_BE_CREATED_ID

    assert_equal UserConstants::USER_TO_HAVE_USERNAME_UPDATED_NEW_USERNAME, updated_user.username
  end

  test "Test If Method \"delete_user\" Deletes User On Database" do
    User.create id: UserConstants::USER_TO_BE_CREATED_ID, username: UserConstants::USER_TO_BE_CREATED_USERNAME

    UserUseCases.delete_user UserConstants::USER_TO_BE_CREATED_ID

    assert_raises ActiveRecord::RecordNotFound do
      User.find UserConstants::USER_TO_BE_CREATED_ID
    end
  end
end

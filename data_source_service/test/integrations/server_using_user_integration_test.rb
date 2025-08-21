require "test_helper"

class ServerUsingUserIntegrationTest < ActionDispatch::IntegrationTest
  test "Test Fetching Users" do
    User.create id: UserConstants::FIRST_USER_TO_BE_CREATED_ID, username: UserConstants::USER_TO_BE_CREATED_USERNAME
    User.create id: UserConstants::SECOND_USER_TO_BE_CREATED_ID, username: UserConstants::USER_TO_BE_CREATED_USERNAME

    get UserConstants::USER_ROUTE

    serialize_response_body = JSON.parse response.body

    assert_response :ok
    assert_equal NoteConstants::NUMBER_OF_NOTES_CREATED_BY_UNIQUE_USER, serialize_response_body.length
  end

  test "Test Fetching User" do
    UserUseCases.create_user UserConstants::USER_TO_BE_CREATED_USERNAME, UserConstants::USER_TO_BE_CREATED_ID

    get UserConstants::USER_ROUTE + UserConstants::USER_TO_BE_CREATED_ID.to_s

    serialize_response_body = JSON.parse response.body

    assert_response :ok
    assert_equal UserConstants::USER_TO_BE_CREATED_ID, serialize_response_body[UserConstants::USER_MAP_ID_KEY]
    assert_equal UserConstants::USER_TO_BE_CREATED_USERNAME, serialize_response_body[UserConstants::USER_MAP_USERNAME_KEY]
  end

  test "Test Creating User" do
    post UserConstants::USER_ROUTE, params: {
      id: UserConstants::USER_TO_BE_CREATED_ID,
      username: UserConstants::USER_TO_BE_CREATED_USERNAME
    }.to_json

    created_user = UserUseCases.get_user UserConstants::USER_TO_BE_CREATED_ID

    assert_response :created
    assert_equal UserConstants::USER_TO_BE_CREATED_ID, created_user.id
    assert_equal UserConstants::USER_TO_BE_CREATED_USERNAME, created_user.username
  end

  test "Test Updating User" do
    UserUseCases.create_user UserConstants::USER_TO_BE_CREATED_USERNAME, UserConstants::USER_TO_BE_CREATED_ID

    patch UserConstants::USER_ROUTE + UserConstants::USER_TO_BE_CREATED_ID.to_s, params: {
      username: UserConstants::USER_TO_HAVE_USERNAME_UPDATED_NEW_USERNAME
    }.to_json

    updated_user = UserUseCases.get_user UserConstants::USER_TO_BE_CREATED_ID

    assert_response :ok
    assert_equal UserConstants::USER_TO_HAVE_USERNAME_UPDATED_NEW_USERNAME, updated_user.username
  end

  test "Test Deleting User" do
    UserUseCases.create_user UserConstants::USER_TO_BE_CREATED_USERNAME, UserConstants::USER_TO_BE_CREATED_ID

    delete UserConstants::USER_ROUTE + UserConstants::USER_TO_BE_CREATED_ID.to_s

    assert_response :no_content

    assert_raises ActiveRecord::RecordNotFound do
      UserUseCases.get_user UserConstants::USER_TO_BE_CREATED_ID
    end
  end
end

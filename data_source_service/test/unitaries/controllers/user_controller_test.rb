require "test_helper"

class UserControllerTest < ActionDispatch::IntegrationTest
  test "Test If Method \"get_all_users\" Renders All User From Database On Router" do
    User.create id: UserConstants::FIRST_USER_TO_BE_CREATED_ID, username: UserConstants::USER_TO_BE_CREATED_USERNAME
    User.create id: UserConstants::SECOND_USER_TO_BE_CREATED_ID, username: UserConstants::USER_TO_BE_CREATED_USERNAME

    get UserConstants::USER_ROUTE

    serialize_response_body = JSON.parse response.body

    assert_response :ok
    assert_equal NoteConstants::NUMBER_OF_NOTES_CREATED_BY_UNIQUE_USER, serialize_response_body.length
  end

  test "Test If Method \"get_user\" Renders User From Database On Router" do
    UserUseCases.create_user UserConstants::USER_TO_BE_CREATED_USERNAME, UserConstants::USER_TO_BE_CREATED_ID

    get UserConstants::USER_ROUTE + UserConstants::USER_TO_BE_CREATED_ID.to_s

    serialize_response_body = JSON.parse response.body

    assert_response :ok
    assert_equal UserConstants::USER_TO_BE_CREATED_ID, serialize_response_body[UserConstants::USER_MAP_ID_KEY]
    assert_equal UserConstants::USER_TO_BE_CREATED_USERNAME, serialize_response_body[UserConstants::USER_MAP_USERNAME_KEY]
  end

  test "Test If Method \"get_user\" Renders Not Found Status Code When User Does Not Exist" do
    get UserConstants::USER_ROUTE + UserConstants::USER_TO_BE_CREATED_ID.to_s

    assert_response :not_found
  end

  test "Test If Method \"create_user\" Renders Created Status Code And Save User On Database" do
    post UserConstants::USER_ROUTE, params: {
      id: UserConstants::USER_TO_BE_CREATED_ID,
      username: UserConstants::USER_TO_BE_CREATED_USERNAME
    }.to_json

    created_user = UserUseCases.get_user UserConstants::USER_TO_BE_CREATED_ID

    assert_response :created
    assert_equal UserConstants::USER_TO_BE_CREATED_ID, created_user.id
    assert_equal UserConstants::USER_TO_BE_CREATED_USERNAME, created_user.username
  end

  test "Test If Method \"create_user\" Renders Conflict Status Code If There Is A User With Same Id Already" do
    User.create id: UserConstants::USER_TO_BE_CREATED_ID, username: UserConstants::USER_TO_BE_CREATED_USERNAME

    post UserConstants::USER_ROUTE, params: {
      id: UserConstants::USER_TO_BE_CREATED_ID,
      username: UserConstants::USER_TO_BE_CREATED_USERNAME
    }.to_json

    assert_response :conflict
  end

  test "Test If Method \"update_user\" Renders Success Status If User Was Updated On Database" do
    UserUseCases.create_user UserConstants::USER_TO_BE_CREATED_USERNAME, UserConstants::USER_TO_BE_CREATED_ID

    patch UserConstants::USER_ROUTE + UserConstants::USER_TO_BE_CREATED_ID.to_s, params: {
      username: UserConstants::USER_TO_HAVE_USERNAME_UPDATED_NEW_USERNAME
    }.to_json

    updated_user = UserUseCases.get_user UserConstants::USER_TO_BE_CREATED_ID

    assert_response :ok
    assert_equal UserConstants::USER_TO_HAVE_USERNAME_UPDATED_NEW_USERNAME, updated_user.username
  end

  test "Test If Method \"update_user\" Renders Not Found Status If User Does Not Exist" do
    patch UserConstants::USER_ROUTE + UserConstants::USER_TO_BE_CREATED_ID.to_s, params: {
      username: UserConstants::USER_TO_HAVE_USERNAME_UPDATED_NEW_USERNAME
    }.to_json

    assert_response :not_found
  end

  test "Test If Method \"delete_user\" Render No Content Status If User Was Deleted On Database" do
    UserUseCases.create_user UserConstants::USER_TO_BE_CREATED_USERNAME, UserConstants::USER_TO_BE_CREATED_ID

    delete UserConstants::USER_ROUTE + UserConstants::USER_TO_BE_CREATED_ID.to_s

    assert_response :no_content

    assert_raises ActiveRecord::RecordNotFound do
      UserUseCases.get_user UserConstants::USER_TO_BE_CREATED_ID
    end
  end

  test "Test If Method \"delete_user\" Renders Not Found Status If User Does Not Exist" do
    delete UserConstants::USER_ROUTE + UserConstants::USER_TO_BE_CREATED_ID.to_s

    assert_response :not_found
  end
end

require "test_helper"

class ServerUsingNoteIntegrationTest < ActionDispatch::IntegrationTest
  test "Test Fetching Notes" do
    UserUseCases.create_user UserConstants::USER_TO_BE_CREATED_ID, UserConstants::USER_TO_BE_CREATED_USERNAME

    NoteUseCases.create_note NoteConstants::FIRST_NOTE_TO_BE_CREATED_ID,
      NoteConstants::NOTE_TO_BE_CREATED_TITLE,
      NoteConstants::NOTE_TO_BE_CREATED_BODY,
      NoteConstants::NOTE_TO_BE_CREATED_CREATED_AT_TIMESTAMP,
      NoteConstants::NOTE_TO_BE_CREATED_UPDATED_AT_TIMESTAMP,
      UserConstants::USER_TO_BE_CREATED_ID

    NoteUseCases.create_note NoteConstants::SECOND_NOTE_TO_BE_CREATED_ID,
      NoteConstants::NOTE_TO_BE_CREATED_TITLE,
      NoteConstants::NOTE_TO_BE_CREATED_BODY,
      NoteConstants::NOTE_TO_BE_CREATED_CREATED_AT_TIMESTAMP,
      NoteConstants::NOTE_TO_BE_CREATED_UPDATED_AT_TIMESTAMP,
      UserConstants::USER_TO_BE_CREATED_ID

    get NoteConstants::NOTE_ROUTE + UserConstants::USER_TO_BE_CREATED_ID.to_s

    serialize_response_body = JSON.parse response.body

    assert_response :ok
    assert_equal NoteConstants::NUMBER_OF_NOTES_CREATED_BY_UNIQUE_USER, serialize_response_body.length
  end

  test "Test Fetching Note" do
    UserUseCases.create_user UserConstants::USER_TO_BE_CREATED_ID, UserConstants::USER_TO_BE_CREATED_USERNAME

    NoteUseCases.create_note NoteConstants::NOTE_TO_BE_CREATED_ID,
      NoteConstants::NOTE_TO_BE_CREATED_TITLE,
      NoteConstants::NOTE_TO_BE_CREATED_BODY,
      NoteConstants::NOTE_TO_BE_CREATED_CREATED_AT_TIMESTAMP,
      NoteConstants::NOTE_TO_BE_CREATED_UPDATED_AT_TIMESTAMP,
      UserConstants::USER_TO_BE_CREATED_ID

    get "#{NoteConstants::NOTE_ROUTE + UserConstants::USER_TO_BE_CREATED_ID.to_s}/#{NoteConstants::NOTE_TO_BE_CREATED_ID}"

    serialize_response_body = JSON.parse response.body

    assert_response :ok
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_ID, serialize_response_body[NoteConstants::NOTE_MAP_ID_KEY]
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_TITLE, serialize_response_body[NoteConstants::NOTE_MAP_TITLE_KEY]
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_BODY, serialize_response_body[NoteConstants::NOTE_MAP_BODY_KEY]
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_CREATED_AT_TIMESTAMP, serialize_response_body[NoteConstants::NOTE_MAP_CREATED_AT_KEY]
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_UPDATED_AT_TIMESTAMP, serialize_response_body[NoteConstants::NOTE_MAP_UPDATED_AT_KEY]
    assert_equal UserConstants::USER_TO_BE_CREATED_ID, serialize_response_body[NoteConstants::NOTE_MAP_USER_ID_KEY]
  end

  test "Test Creating Notes" do
    UserUseCases.create_user UserConstants::USER_TO_BE_CREATED_USERNAME, UserConstants::USER_TO_BE_CREATED_ID

    post NoteConstants::NOTE_ROUTE + UserConstants::USER_TO_BE_CREATED_ID.to_s, params: {
      id: NoteConstants::NOTE_TO_BE_CREATED_ID,
      title: NoteConstants::NOTE_TO_BE_CREATED_TITLE,
      body: NoteConstants::NOTE_TO_BE_CREATED_BODY,
      createdAt: NoteConstants::NOTE_TO_BE_CREATED_CREATED_AT_TIMESTAMP,
      updatedAt: NoteConstants::NOTE_TO_BE_CREATED_UPDATED_AT_TIMESTAMP
    }.to_json

    created_note = NoteUseCases.get_note NoteConstants::NOTE_TO_BE_CREATED_ID

    assert_response :created
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_ID, created_note.id
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_TITLE, created_note.title
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_BODY, created_note.body
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_CREATED_AT_TIMESTAMP, created_note.created_at
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_UPDATED_AT_TIMESTAMP, created_note.updated_at
    assert_equal UserConstants::USER_TO_BE_CREATED_ID, created_note.user_id
  end

  test "Test Updating Notes" do
    UserUseCases.create_user UserConstants::USER_TO_BE_CREATED_USERNAME, UserConstants::USER_TO_BE_CREATED_ID

    NoteUseCases.create_note NoteConstants::NOTE_TO_BE_CREATED_ID,
      NoteConstants::NOTE_TO_BE_CREATED_TITLE,
      NoteConstants::NOTE_TO_BE_CREATED_BODY,
      NoteConstants::NOTE_TO_BE_CREATED_CREATED_AT_TIMESTAMP,
      NoteConstants::NOTE_TO_BE_CREATED_UPDATED_AT_TIMESTAMP,
      UserConstants::USER_TO_BE_CREATED_ID

    patch "#{NoteConstants::NOTE_ROUTE + UserConstants::USER_TO_BE_CREATED_ID.to_s}/#{NoteConstants::NOTE_TO_BE_CREATED_ID}", params: {
      title: NoteConstants::UPDATED_NOTE_TITLE,
      body: NoteConstants::UPDATED_NOTE_BODY,
      updatedAt: NoteConstants::NOTE_TO_BE_UPDATED_UPDATED_AT_TIMESTAMP
    }.to_json

    updated_note = NoteUseCases.get_note NoteConstants::NOTE_TO_BE_CREATED_ID

    assert_response :ok
    assert_equal NoteConstants::UPDATED_NOTE_TITLE, updated_note.title
    assert_equal NoteConstants::UPDATED_NOTE_BODY, updated_note.body
    assert_equal NoteConstants::NOTE_TO_BE_UPDATED_UPDATED_AT_TIMESTAMP, updated_note.updated_at
  end

  test "Test Deleting Notes" do
    UserUseCases.create_user UserConstants::USER_TO_BE_CREATED_USERNAME, UserConstants::USER_TO_BE_CREATED_ID

    NoteUseCases.create_note NoteConstants::NOTE_TO_BE_CREATED_ID,
      NoteConstants::NOTE_TO_BE_CREATED_TITLE,
      NoteConstants::NOTE_TO_BE_CREATED_BODY,
      NoteConstants::NOTE_TO_BE_CREATED_CREATED_AT_TIMESTAMP,
      NoteConstants::NOTE_TO_BE_CREATED_UPDATED_AT_TIMESTAMP,
      UserConstants::USER_TO_BE_CREATED_ID

    delete "#{NoteConstants::NOTE_ROUTE + UserConstants::USER_TO_BE_CREATED_ID.to_s}/#{NoteConstants::NOTE_TO_BE_CREATED_ID}"

    assert_response :no_content

    assert_raises ActiveRecord::RecordNotFound do
      NoteUseCases.get_note NoteConstants::NOTE_TO_BE_CREATED_ID
    end
  end
end

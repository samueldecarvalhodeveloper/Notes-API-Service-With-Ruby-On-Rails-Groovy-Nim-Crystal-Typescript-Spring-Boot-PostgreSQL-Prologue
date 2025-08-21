require "test_helper"

class NoteComponentTest < ActiveSupport::TestCase
  test "Test Fetching Note From Database" do
    User.create id: UserConstants::USER_TO_BE_CREATED_ID, username: UserConstants::USER_TO_BE_CREATED_USERNAME

    Note.create id: NoteConstants::NOTE_TO_BE_CREATED_ID,
      title: NoteConstants::NOTE_TO_BE_CREATED_TITLE,
      body: NoteConstants::NOTE_TO_BE_CREATED_BODY,
      created_at: NoteConstants::NOTE_TO_BE_CREATED_CREATED_AT_TIMESTAMP,
      updated_at: NoteConstants::NOTE_TO_BE_CREATED_UPDATED_AT_TIMESTAMP,
      user_id: UserConstants::USER_TO_BE_CREATED_ID

    created_note = NoteUseCases.get_note NoteConstants::NOTE_TO_BE_CREATED_ID

    assert_equal NoteConstants::NOTE_TO_BE_CREATED_ID, created_note.id
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_TITLE, created_note.title
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_BODY, created_note.body
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_CREATED_AT_TIMESTAMP, created_note.created_at
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_UPDATED_AT_TIMESTAMP, created_note.updated_at
  end

  test "Test Fetching All Notes From Database" do
    User.create id: UserConstants::USER_TO_BE_CREATED_ID, username: UserConstants::USER_TO_BE_CREATED_USERNAME

    Note.create id: NoteConstants::FIRST_NOTE_TO_BE_CREATED_ID,
      title: NoteConstants::NOTE_TO_BE_CREATED_TITLE,
      body: NoteConstants::NOTE_TO_BE_CREATED_BODY,
      created_at: NoteConstants::NOTE_TO_BE_CREATED_CREATED_AT_TIMESTAMP,
      updated_at: NoteConstants::NOTE_TO_BE_CREATED_UPDATED_AT_TIMESTAMP,
      user_id: UserConstants::USER_TO_BE_CREATED_ID

    Note.create id: NoteConstants::SECOND_NOTE_TO_BE_CREATED_ID,
      title: NoteConstants::NOTE_TO_BE_CREATED_TITLE,
      body: NoteConstants::NOTE_TO_BE_CREATED_BODY,
      created_at: NoteConstants::NOTE_TO_BE_CREATED_CREATED_AT_TIMESTAMP,
      updated_at: NoteConstants::NOTE_TO_BE_CREATED_UPDATED_AT_TIMESTAMP,
      user_id: UserConstants::USER_TO_BE_CREATED_ID

    created_notes = NoteUseCases.get_all_notes UserConstants::USER_TO_BE_CREATED_ID

    assert_equal NoteConstants::NUMBER_OF_NOTES_CREATED_BY_UNIQUE_USER, created_notes.length
  end

  test "Test Creating Note On Database" do
    User.create id: UserConstants::USER_TO_BE_CREATED_ID, username: UserConstants::USER_TO_BE_CREATED_USERNAME

    NoteUseCases.create_note NoteConstants::NOTE_TO_BE_CREATED_ID, NoteConstants::NOTE_TO_BE_CREATED_TITLE,
      NoteConstants::NOTE_TO_BE_CREATED_BODY,
      NoteConstants::NOTE_TO_BE_CREATED_CREATED_AT_TIMESTAMP,
      NoteConstants::NOTE_TO_BE_CREATED_UPDATED_AT_TIMESTAMP,
      UserConstants::USER_TO_BE_CREATED_ID

    created_note = Note.find NoteConstants::NOTE_TO_BE_CREATED_ID

    assert_equal NoteConstants::NOTE_TO_BE_CREATED_ID, created_note.id
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_TITLE, created_note.title
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_BODY, created_note.body
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_CREATED_AT_TIMESTAMP, created_note.created_at
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_UPDATED_AT_TIMESTAMP, created_note.updated_at
  end

  test "Test Updating Note On Database" do
    User.create id: UserConstants::USER_TO_BE_CREATED_ID, username: UserConstants::USER_TO_BE_CREATED_USERNAME

    Note.create id: NoteConstants::NOTE_TO_BE_CREATED_ID,
      title: NoteConstants::NOTE_TO_BE_CREATED_TITLE,
      body: NoteConstants::NOTE_TO_BE_CREATED_BODY,
      created_at: NoteConstants::NOTE_TO_BE_CREATED_CREATED_AT_TIMESTAMP,
      updated_at: NoteConstants::NOTE_TO_BE_CREATED_UPDATED_AT_TIMESTAMP,
      user_id: UserConstants::USER_TO_BE_CREATED_ID

    NoteUseCases.update_note NoteConstants::UPDATED_NOTE_TITLE,
      NoteConstants::UPDATED_NOTE_BODY,
      NoteConstants::NOTE_TO_BE_UPDATED_UPDATED_AT_TIMESTAMP,
      NoteConstants::NOTE_TO_BE_CREATED_ID

    updated_note = Note.find NoteConstants::NOTE_TO_BE_CREATED_ID

    assert_equal NoteConstants::UPDATED_NOTE_TITLE, updated_note.title
    assert_equal NoteConstants::UPDATED_NOTE_BODY, updated_note.body
    assert_equal NoteConstants::NOTE_TO_BE_UPDATED_UPDATED_AT_TIMESTAMP, updated_note.updated_at
  end

  test "Test Deleting Note On Database" do
    User.create id: UserConstants::USER_TO_BE_CREATED_ID, username: UserConstants::USER_TO_BE_CREATED_USERNAME

    Note.create id: NoteConstants::NOTE_TO_BE_CREATED_ID,
      title: NoteConstants::NOTE_TO_BE_CREATED_TITLE,
      body: NoteConstants::NOTE_TO_BE_CREATED_BODY,
      created_at: NoteConstants::NOTE_TO_BE_CREATED_CREATED_AT_TIMESTAMP,
      updated_at: NoteConstants::NOTE_TO_BE_CREATED_UPDATED_AT_TIMESTAMP,
      user_id: UserConstants::USER_TO_BE_CREATED_ID

    NoteUseCases.delete_note NoteConstants::NOTE_TO_BE_CREATED_ID

    assert_raises ActiveRecord::RecordNotFound do
      NoteUseCases.get_note NoteConstants::NOTE_TO_BE_CREATED_ID
    end
  end
end

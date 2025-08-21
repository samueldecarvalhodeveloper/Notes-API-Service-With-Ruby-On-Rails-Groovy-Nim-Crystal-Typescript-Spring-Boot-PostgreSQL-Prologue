require "test_helper"

class NoteTest < ActiveSupport::TestCase
  test "Test If Model Was Configured Correctly" do
    User.create id: UserConstants::USER_TO_BE_CREATED_ID, username: UserConstants::USER_TO_BE_CREATED_USERNAME

    Note.create id: NoteConstants::NOTE_TO_BE_CREATED_ID,
      title: NoteConstants::NOTE_TO_BE_CREATED_TITLE,
      body: NoteConstants::NOTE_TO_BE_CREATED_BODY,
      created_at: NoteConstants::NOTE_TO_BE_CREATED_CREATED_AT_TIMESTAMP,
      updated_at: NoteConstants::NOTE_TO_BE_CREATED_UPDATED_AT_TIMESTAMP,
      user_id: UserConstants::USER_TO_BE_CREATED_ID

    created_note = Note.find NoteConstants::NOTE_TO_BE_CREATED_ID

    assert_equal NoteConstants::NOTE_TO_BE_CREATED_ID, created_note.id
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_TITLE, created_note.title
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_BODY, created_note.body
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_CREATED_AT_TIMESTAMP, created_note.created_at
    assert_equal NoteConstants::NOTE_TO_BE_CREATED_UPDATED_AT_TIMESTAMP, created_note.updated_at
  end
end

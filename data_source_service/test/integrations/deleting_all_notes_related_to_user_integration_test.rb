require "test_helper"

class DeletingAllNotesRelatedToUserIntegrationTest < ActiveSupport::TestCase
  test "Test If Delete User Deletes All Notes Related To It" do
    User.create id: UserConstants::USER_TO_BE_CREATED_ID, username: UserConstants::USER_TO_BE_CREATED_USERNAME

    Note.create id: NoteConstants::NOTE_TO_BE_CREATED_ID,
      title: NoteConstants::NOTE_TO_BE_CREATED_TITLE,
      body: NoteConstants::NOTE_TO_BE_CREATED_BODY,
      created_at: NoteConstants::NOTE_TO_BE_CREATED_CREATED_AT_TIMESTAMP,
      updated_at: NoteConstants::NOTE_TO_BE_CREATED_UPDATED_AT_TIMESTAMP,
      user_id: UserConstants::USER_TO_BE_CREATED_ID

    user_to_be_deleted = User.find UserConstants::USER_TO_BE_CREATED_ID

    user_to_be_deleted.destroy

    assert_raises ActiveRecord::RecordNotFound do
      NoteUseCases.get_note NoteConstants::NOTE_TO_BE_CREATED_ID
    end
  end
end

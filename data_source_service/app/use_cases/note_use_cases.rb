class NoteUseCases
  def self.get_note id
    Note.find id
  end

  def self.get_all_notes id
    Note.where(user_id: id)
  end

  def self.create_note id, title, body, created_at, updated_at, user_id
    Note.create id: id, title: title, body: body, created_at: created_at, updated_at: updated_at, user_id: user_id
  end

  def self.update_note title, body, updated_at, id
    note_to_be_updated = Note.find id

    note_to_be_updated.title = title
    note_to_be_updated.body = body
    note_to_be_updated.updated_at = updated_at

    note_to_be_updated.save
  end

  def self.delete_note id
    note_to_be_deleted = Note.find id

    note_to_be_deleted.destroy
  end
end

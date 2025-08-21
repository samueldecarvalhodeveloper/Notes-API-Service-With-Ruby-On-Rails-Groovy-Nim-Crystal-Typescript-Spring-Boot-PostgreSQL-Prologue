class NoteController < ApplicationController
  def get_all_notes
    begin
      id = params[:id]

      VerifyIfUserExistsCommand.execute id

      all_user_notes = NoteUseCases.get_all_notes id

      render json: all_user_notes, status:200
    rescue StandardError
      render status: 404
    end
  end

  def get_note
    begin
      note_id = params[:note_id]

      note = NoteUseCases.get_note note_id

      render json: note, status: 200
    rescue StandardError
      render status: 404
    end
  end

  def create_note
    begin
      serialize_request_body = JSON.parse request.raw_post

      id = serialize_request_body[NoteConstants::NOTE_MAP_ID_KEY]
      title = serialize_request_body[NoteConstants::NOTE_MAP_TITLE_KEY]
      body = serialize_request_body[NoteConstants::NOTE_MAP_BODY_KEY]
      created_at = serialize_request_body[NoteConstants::NOTE_MAP_CREATED_AT_KEY]
      updated_at = serialize_request_body[NoteConstants::NOTE_MAP_UPDATED_AT_KEY]
      user_id = params[:id]
      
      VerifyIfUserExistsCommand.execute user_id
      
      NoteUseCases.create_note id, title, body, created_at, updated_at, user_id

      render status: 201
    rescue ActiveRecord::RecordNotUnique
      render status: 409

    rescue ActiveRecord::RecordNotFound
      render status: 404
    end
  end

  def update_note
    begin
      serialize_request_body = JSON.parse request.raw_post

      id = params[:note_id]
      title = serialize_request_body[NoteConstants::NOTE_MAP_TITLE_KEY]
      body = serialize_request_body[NoteConstants::NOTE_MAP_BODY_KEY]
      updated_at = serialize_request_body[NoteConstants::NOTE_MAP_UPDATED_AT_KEY]
      user_id = params[:id]

      NoteUseCases.update_note(title, body, updated_at, id)

      render status: 200
    rescue StandardError
      render status: 404
    end
  end

  def delete_note
    begin
      id = params[:note_id]

      NoteUseCases.delete_note id

      render status: 204
    rescue StandardError
      render status: 404
    end
  end
end

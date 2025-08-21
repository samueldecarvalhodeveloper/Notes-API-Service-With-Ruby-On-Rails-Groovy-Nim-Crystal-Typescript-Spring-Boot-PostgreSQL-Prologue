package com.samueldecarvalhodeveloper.message_queue_service.domains.note

import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.entities.NoteEntity

class NoteRepository {
    private NoteActiveRecord noteActiveRecord

    NoteRepository(NoteActiveRecord noteActiveRecord) {
        this.noteActiveRecord = noteActiveRecord
    }

    ArrayList<NoteEntity> getNotes(Integer id) {
        return noteActiveRecord.getNotesFromDatabase(id)
    }

    NoteEntity getNote(Integer id, Integer userId) {
        return noteActiveRecord.getNoteFromDatabase(id, userId)
    }

    void createNote(NoteEntity note) {
        noteActiveRecord.createNoteOnDatabase(note)
    }

    void updateNote(NoteEntity note) {
        noteActiveRecord.updateNoteOnDatabase(note)
    }

    void deleteNote(Integer id, Integer userId) {
        noteActiveRecord.deleteNoteOnDatabase(id, userId)
    }
}

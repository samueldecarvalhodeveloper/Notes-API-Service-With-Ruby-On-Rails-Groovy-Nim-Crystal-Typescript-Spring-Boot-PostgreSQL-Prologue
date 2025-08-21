package com.samueldecarvalhodeveloper.message_queue_service.domains.note

import com.samueldecarvalhodeveloper.message_queue_service.domains.event_queue.EventQueue
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.entities.NoteEntity

class NoteActiveRecord {
    private NoteDataSourceGateway noteDataSourceGateway
    private NoteInMemoryCacheGateway noteInMemoryCacheGateway

    NoteActiveRecord(NoteDataSourceGateway noteDataSourceGateway, NoteInMemoryCacheGateway noteInMemoryCacheGateway) {
        this.noteDataSourceGateway = noteDataSourceGateway
        this.noteInMemoryCacheGateway = noteInMemoryCacheGateway
    }

    ArrayList<NoteEntity> getNotesFromDatabase(Integer id) {
        return noteInMemoryCacheGateway.getNotesFromInMemoryDatabase(id)
    }

    NoteEntity getNoteFromDatabase(Integer id, Integer userId) {
        return noteInMemoryCacheGateway.getNoteFromInMemoryDatabase(id, userId)
    }

    void createNoteOnDatabase(NoteEntity note) {
        noteInMemoryCacheGateway.createNoteOnInMemoryDatabase(note)

        EventQueue.addEvent {
            noteDataSourceGateway.createNoteOnDataSourceDatabase(note)
        }
    }

    void updateNoteOnDatabase(NoteEntity note) {
        noteInMemoryCacheGateway.updateNoteOnInMemoryDatabase(note)

        EventQueue.addEvent {
            noteDataSourceGateway.updateNoteOnDataSourceDatabase(note)
        }
    }

    void deleteNoteOnDatabase(Integer id, Integer userId) {
        noteInMemoryCacheGateway.deleteNoteOnInMemoryDatabase(id, userId)

        EventQueue.addEvent {
            noteDataSourceGateway.deleteNoteOnDataSourceDatabase(id, userId)
        }
    }
}

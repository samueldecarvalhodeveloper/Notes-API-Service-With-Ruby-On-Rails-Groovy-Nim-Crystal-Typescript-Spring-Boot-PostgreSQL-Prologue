package com.samueldecarvalhodeveloper.message_queue_service.domains.note

import com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants
import com.samueldecarvalhodeveloper.message_queue_service.constants.domains.NoteConstants
import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.HttpClient
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.entities.NoteEntity

class NoteDataSourceGateway {
    void createNoteOnDataSourceDatabase(NoteEntity note) {
        HttpClient.getPostRequestResponse(
                ApplicationConstants.DATA_SOURCE_SERVICE_URL + NoteConstants.NOTE_ROUTE + note.userId,
                note
        )
    }

    void updateNoteOnDataSourceDatabase(NoteEntity note) {
        HttpClient.getPatchRequestResponse(
                ApplicationConstants.DATA_SOURCE_SERVICE_URL + NoteConstants.NOTE_ROUTE + note.userId + ApplicationConstants.ROUTE_SEPARATOR_CHARACTER + note.id,
                note
        )
    }

    void deleteNoteOnDataSourceDatabase(Integer id, Integer userId) {
        HttpClient.getDeleteRequestResponse(
                ApplicationConstants.DATA_SOURCE_SERVICE_URL + NoteConstants.NOTE_ROUTE + userId + ApplicationConstants.ROUTE_SEPARATOR_CHARACTER + id
        )
    }
}

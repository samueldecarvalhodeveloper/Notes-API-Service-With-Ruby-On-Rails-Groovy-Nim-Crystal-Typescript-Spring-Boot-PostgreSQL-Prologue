package com.samueldecarvalhodeveloper.message_queue_service.domains.note

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.HttpClient
import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.infrastructure.entities.ResponseEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.infrastructure.entities.ResponseWithoutBodyEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.entities.NoteEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.exceptions.NotExistingNoteException
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserValidator
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.exceptions.NotExistingUserException

import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.IN_MEMORY_SERVICE_URL
import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.ROUTE_SEPARATOR_CHARACTER
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.NoteConstants.NOTE_ROUTE

class NoteInMemoryCacheGateway {
    ArrayList<NoteEntity> getNotesFromInMemoryDatabase(Integer id) {
        try {
            ResponseEntity<ArrayList<NoteEntity>> response = HttpClient.getGetRequestResponse(
                    IN_MEMORY_SERVICE_URL + NOTE_ROUTE + id,
                    ArrayList<UserEntity>.class
            )

            return response.body
        } catch (Exception ignored) {
            throw new NotExistingUserException()
        }
    }

    NoteEntity getNoteFromInMemoryDatabase(Integer id, Integer userId) {
        try {
            ResponseEntity<NoteEntity> response = HttpClient.getGetRequestResponse(
                    IN_MEMORY_SERVICE_URL + NOTE_ROUTE + userId + ROUTE_SEPARATOR_CHARACTER + id,
                    NoteEntity.class
            )

            return response.body
        } catch (Exception ignored) {
            throw new NotExistingNoteException()
        }
    }

    void createNoteOnInMemoryDatabase(NoteEntity note) {
        ResponseWithoutBodyEntity response = HttpClient.getPostRequestResponse(
                IN_MEMORY_SERVICE_URL + NOTE_ROUTE + note.userId,
                note
        )

        UserValidator.validateIfUserExists(response)

        NoteValidator.validateIfNoteAlreadyExists(response)
    }

    void updateNoteOnInMemoryDatabase(NoteEntity note) {
        ResponseWithoutBodyEntity response = HttpClient.getPatchRequestResponse(
                IN_MEMORY_SERVICE_URL + NOTE_ROUTE + note.userId + ROUTE_SEPARATOR_CHARACTER + note.id,
                note
        )

        NoteValidator.validateIfNoteExists(response)
    }

    void deleteNoteOnInMemoryDatabase(Integer id, Integer userId) {
        ResponseWithoutBodyEntity response = HttpClient.getDeleteRequestResponse(
                IN_MEMORY_SERVICE_URL + NOTE_ROUTE + userId + ROUTE_SEPARATOR_CHARACTER + id
        )

        NoteValidator.validateIfNoteExists(response)
    }
}

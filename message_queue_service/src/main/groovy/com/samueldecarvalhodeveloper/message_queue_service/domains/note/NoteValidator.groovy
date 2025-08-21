package com.samueldecarvalhodeveloper.message_queue_service.domains.note

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.infrastructure.entities.ResponseWithoutBodyEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.exceptions.AlreadyExistingNoteException
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.exceptions.NotExistingNoteException

import static com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.specifications.NoteSpecifications.isNoteAlreadyExisting
import static com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.specifications.NoteSpecifications.isNoteNotFound

class NoteValidator {
    private NoteValidator() {}

    static void validateIfNoteExists(ResponseWithoutBodyEntity response) {
        if (isNoteNotFound(response.statusCode)) {
            throw new NotExistingNoteException()
        }
    }

    static void validateIfNoteAlreadyExists(ResponseWithoutBodyEntity response) {
        if (isNoteAlreadyExisting(response.statusCode)) {
            throw new AlreadyExistingNoteException()
        }
    }
}

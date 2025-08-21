package com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.specifications

import org.springframework.http.HttpStatus

class NoteSpecifications {
    private NoteSpecifications() {}

    static boolean isNoteNotFound(Integer responseStatusCode) {
        return responseStatusCode == HttpStatus.NOT_FOUND.value()
    }

    static boolean isNoteAlreadyExisting(Integer responseStatusCode) {
        return responseStatusCode == HttpStatus.CONFLICT.value()
    }
}

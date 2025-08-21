package com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.exceptions

import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.NoteConstants.NOT_EXISTING_NOTE_EXCEPTION_MESSAGE

class NotExistingNoteException extends Exception {
    NotExistingNoteException() {
        super(NOT_EXISTING_NOTE_EXCEPTION_MESSAGE)
    }
}

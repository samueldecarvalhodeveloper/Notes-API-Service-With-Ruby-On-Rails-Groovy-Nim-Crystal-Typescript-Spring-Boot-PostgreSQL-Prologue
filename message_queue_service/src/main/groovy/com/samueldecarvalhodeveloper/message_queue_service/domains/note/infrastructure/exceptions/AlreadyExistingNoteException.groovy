package com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.exceptions

import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.NoteConstants.ALREADY_EXISTING_NOTE_EXCEPTION_MESSAGE

class AlreadyExistingNoteException extends Exception {
    AlreadyExistingNoteException() {
        super(ALREADY_EXISTING_NOTE_EXCEPTION_MESSAGE)
    }
}

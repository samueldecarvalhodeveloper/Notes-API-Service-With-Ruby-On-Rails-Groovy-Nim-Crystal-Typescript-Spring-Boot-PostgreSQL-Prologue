package com.samueldecarvalhodeveloper.message_queue_service.constants.domains

import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.entities.NoteEntity

import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.USER_ID

class NoteConstants {
    private NoteConstants() {}

    static final String NOT_EXISTING_NOTE_EXCEPTION_MESSAGE = "Note Does Not Exist"

    static final String ALREADY_EXISTING_NOTE_EXCEPTION_MESSAGE = "Note Already Exists"

    static final String NOTE_ROUTE = "/notes/"

    static final Integer NOTE_ID = 1

    static final String NOTE_TITLE = "Title"

    static final String NOTE_BODY = "Body"

    static final Integer NOTE_CREATED_AT = 20

    static final Integer NOTE_UPDATED_AT = 20

    static final String NOT_WANTED_NOTE_TITLE = "Other Title"

    static final String NOTE_JSON = "{\"id\":1,\"title\":\"title\",\"body\":\"body\",\"createdAt\":20,\"updatedAt\":20,\"userId\":0}"

    static final NoteEntity NOTE_OBJECT = new NoteEntity(NOTE_ID, NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

    static final Integer NOT_EXISTING_USER_ID = 50

    static final String NOT_EXISTING_USER_NOTE_JSON = "{\"id\":1,\"title\":\"title\",\"body\":\"body\",\"createdAt\":20,\"updatedAt\":20,\"userId\":50}"
}

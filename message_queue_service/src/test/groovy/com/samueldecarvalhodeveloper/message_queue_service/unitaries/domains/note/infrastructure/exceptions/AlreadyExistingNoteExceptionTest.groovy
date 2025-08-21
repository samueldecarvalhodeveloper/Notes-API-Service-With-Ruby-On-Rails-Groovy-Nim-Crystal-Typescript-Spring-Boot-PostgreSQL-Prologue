package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.note.infrastructure.exceptions

import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.exceptions.AlreadyExistingNoteException
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.NoteConstants.ALREADY_EXISTING_NOTE_EXCEPTION_MESSAGE
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class AlreadyExistingNoteExceptionTest {
    @Test
    void testIfExceptionDescribesHowSystemShouldActWhenNoteAlreadyExists() {
        try {
            throw new AlreadyExistingNoteException()
        } catch (Exception exception) {
            assertThat(exception.message).isEqualTo(ALREADY_EXISTING_NOTE_EXCEPTION_MESSAGE)
        }
    }
}

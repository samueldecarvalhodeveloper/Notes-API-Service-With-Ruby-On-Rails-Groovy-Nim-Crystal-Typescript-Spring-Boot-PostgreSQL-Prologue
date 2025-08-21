package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.note

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.ResponseWithoutBodyEntityFactory
import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.infrastructure.entities.ResponseWithoutBodyEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteValidator
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus

import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.NoteConstants.getALREADY_EXISTING_NOTE_EXCEPTION_MESSAGE
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.NoteConstants.getNOT_EXISTING_NOTE_EXCEPTION_MESSAGE
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class NoteValidatorTest {
    @Test
    void testIfMethodValidateIfNoteExistsThrowsNotExistingNoteExceptionINoteDoesNotExistOnDatabase() {
        try {
            ResponseWithoutBodyEntity response =
                    ResponseWithoutBodyEntityFactory.getInstance(HttpStatus.NOT_FOUND.value())

            NoteValidator.validateIfNoteExists(response)
        } catch (Exception exception) {
            assertThat(exception.message).isEqualTo(NOT_EXISTING_NOTE_EXCEPTION_MESSAGE)
        }
    }

    @Test
    void testIfMethodValidateIfNoteAlreadyExistsThrowsAlreadyExistingNoteExceptionIfNoteAlreadyExistsOnDatabase() {
        ResponseWithoutBodyEntity response =
                ResponseWithoutBodyEntityFactory.getInstance(HttpStatus.CONFLICT.value())

        try {
            NoteValidator.validateIfNoteAlreadyExists(response)
        } catch (Exception exception) {
            assertThat(exception.message).isEqualTo(ALREADY_EXISTING_NOTE_EXCEPTION_MESSAGE)
        }
    }
}

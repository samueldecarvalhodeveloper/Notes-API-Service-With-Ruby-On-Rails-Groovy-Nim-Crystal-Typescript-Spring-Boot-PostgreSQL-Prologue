package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.note.infrastructure.specifications

import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.specifications.NoteSpecifications
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus

import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class NoteSpecificationsTest {
    @Test
    void testIfMethodIsNoteNotFoundReturnsTrueIfResponseStatusCodeIsNotFound() {
        boolean noteNotExists = NoteSpecifications.isNoteNotFound(HttpStatus.NOT_FOUND.value())
        boolean noteExists = NoteSpecifications.isNoteNotFound(HttpStatus.OK.value())

        assertThat(noteNotExists).isTrue()
        assertThat(noteExists).isFalse()
    }


    @Test
    void testIfMethodIsNoteAlreadyExistingReturnsTrueIfResponseStatusCodeIsConflict() {
        boolean noteAlreadyExists = NoteSpecifications.isNoteAlreadyExisting(HttpStatus.CONFLICT.value())
        boolean noteNotExists = NoteSpecifications.isNoteAlreadyExisting(HttpStatus.NOT_FOUND.value())

        assertThat(noteAlreadyExists).isTrue()
        assertThat(noteNotExists).isFalse()
    }
}

package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.note.infrastructure.entities

import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.entities.NoteEntity
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.NoteConstants.*
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.getUSER_ID
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class NoteEntityTest {
    @Test
    void testIfEntityDescribesHowNoteShouldBeUsedByTheSystem() {
        NoteEntity note = new NoteEntity(NOTE_ID, NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        assertThat(note.id).isEqualTo(NOTE_ID)
        assertThat(note.title).isEqualTo(NOTE_TITLE)
        assertThat(note.body).isEqualTo(NOTE_BODY)
        assertThat(note.createdAt).isEqualTo(NOTE_CREATED_AT)
        assertThat(note.updatedAt).isEqualTo(NOTE_UPDATED_AT)
        assertThat(note.userId).isEqualTo(USER_ID)
    }
}

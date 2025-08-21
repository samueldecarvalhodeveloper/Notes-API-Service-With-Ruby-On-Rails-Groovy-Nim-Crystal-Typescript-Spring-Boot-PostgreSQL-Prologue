package com.samueldecarvalhodeveloper.message_queue_service.integrations

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.HttpClient
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteRepository
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteRepositoryFactory
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.entities.NoteEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserRepository
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserRepositoryFactory
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.IN_MEMORY_SERVICE_URL
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.NoteConstants.NOTE_ROUTE
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.getUSER_ID
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.getUSER_USERNAME
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class NoteUsingHttpClientIntegrationTest {
    static private UserRepository userRepository

    @BeforeAll
    static void beforeAll() {
        userRepository = UserRepositoryFactory.getInstance()

        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        try {
            userRepository.createUser(user)
        } catch (Exception ignored) {
        }
    }

    @AfterAll
    static void afterAll() {
        userRepository.deleteUser(USER_ID)
    }

    @Test
    void testNoteUsingHttpClientToRequestNotesFromDatabase() {
        ArrayList<NoteEntity> notesFromDatabase =
                HttpClient.getGetRequestResponse(IN_MEMORY_SERVICE_URL + NOTE_ROUTE + USER_ID, ArrayList<NoteEntity>).body

        NoteRepository noteRepository = NoteRepositoryFactory.getInstance()

        ArrayList<NoteEntity> notes = noteRepository.getNotes(USER_ID)

        assertThat(notes).isEqualTo(notesFromDatabase)
    }
}

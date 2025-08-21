package com.samueldecarvalhodeveloper.message_queue_service.integrations

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.HttpClient
import com.samueldecarvalhodeveloper.message_queue_service.domains.json_parser.JsonParser
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteRepository
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteRepositoryFactory
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.entities.NoteEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserRepository
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserRepositoryFactory
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import org.junit.jupiter.api.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.servlet.MockMvc

import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.getIN_MEMORY_SERVICE_URL
import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.getROUTE_SEPARATOR_CHARACTER
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.NoteConstants.*
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.USER_USERNAME
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.getUSER_ID
import static org.assertj.core.api.Assertions.assertThat
import static org.springframework.http.MediaType.APPLICATION_JSON
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
class ServerUsingNoteIntegrationTest {
    @Autowired
    private MockMvc server
    static private UserRepository userRepository
    static private NoteRepository noteRepository

    @BeforeAll
    static void beforeAll() {
        userRepository = UserRepositoryFactory.getInstance()

        noteRepository = NoteRepositoryFactory.getInstance()

        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        try {
            userRepository.createUser(user)
        } catch (Exception ignored) {
        }
    }

    @BeforeEach
    void beforeEach() {
        HttpClient.getDeleteRequestResponse(IN_MEMORY_SERVICE_URL + NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID)
    }

    @AfterEach
    void afterEach() {
        HttpClient.getDeleteRequestResponse(IN_MEMORY_SERVICE_URL + NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID)
    }

    @AfterAll
    static void afterAll() {
        userRepository.deleteUser(USER_ID)
    }

    @Test
    void testServerUsingNoteToManipulateNotesOnDatabase() {
        this.server
                .perform(
                        post(NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER)
                                .contentType(APPLICATION_JSON)
                                .content(NOTE_JSON)
                )
                .andExpect(status().isCreated())

        NoteEntity createdNote = noteRepository.getNote(NOTE_ID, USER_ID)

        assertThat(createdNote.id).isEqualTo(NOTE_ID)
        assertThat(createdNote.title).isEqualTo(NOTE_TITLE)
        assertThat(createdNote.body).isEqualTo(NOTE_BODY)
        assertThat(createdNote.createdAt).isEqualTo(NOTE_CREATED_AT)
        assertThat(createdNote.updatedAt).isEqualTo(NOTE_UPDATED_AT)
        assertThat(createdNote.userId).isEqualTo(USER_ID)

        String notesFromDatabase =
                JsonParser.getJsonStringOfObject(
                        HttpClient
                                .getGetRequestResponse(IN_MEMORY_SERVICE_URL + NOTE_ROUTE + USER_ID, ArrayList<NoteEntity>)
                                .body
                )

        this.server
                .perform(get(NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER))
                .andExpect(status().isOk())
                .andExpect(content().string(notesFromDatabase.toString()))

        NoteEntity noteWithWrongData =
                new NoteEntity(NOTE_ID, NOT_WANTED_NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        noteRepository.updateNote(noteWithWrongData)

        this.server
                .perform(
                        patch(NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID + ROUTE_SEPARATOR_CHARACTER)
                                .contentType(APPLICATION_JSON)
                                .content(NOTE_JSON)
                )
                .andExpect(status().isOk())

        NoteEntity updatedNote = noteRepository.getNote(NOTE_ID, USER_ID)

        assertThat(updatedNote.id).isEqualTo(NOTE_ID)
        assertThat(updatedNote.title).isEqualTo(NOTE_TITLE)
        assertThat(updatedNote.body).isEqualTo(NOTE_BODY)
        assertThat(updatedNote.createdAt).isEqualTo(NOTE_CREATED_AT)
        assertThat(updatedNote.updatedAt).isEqualTo(NOTE_UPDATED_AT)
        assertThat(updatedNote.userId).isEqualTo(USER_ID)

        this.server
                .perform(delete(NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID + ROUTE_SEPARATOR_CHARACTER))
                .andExpect(status().isNoContent())

        try {
            noteRepository.getNote(NOTE_ID, USER_ID)
        } catch (Exception exception) {
            assertThat(exception.message).isNotEmpty()
        }
    }
}

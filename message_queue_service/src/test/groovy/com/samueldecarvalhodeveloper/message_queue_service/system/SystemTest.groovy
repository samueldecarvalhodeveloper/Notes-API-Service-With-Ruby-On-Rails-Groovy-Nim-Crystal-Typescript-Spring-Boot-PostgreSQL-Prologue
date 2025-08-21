package com.samueldecarvalhodeveloper.message_queue_service.system

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.HttpClient
import com.samueldecarvalhodeveloper.message_queue_service.domains.json_parser.JsonParser
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteRepository
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteRepositoryFactory
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.entities.NoteEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserRepository
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserRepositoryFactory
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import com.samueldecarvalhodeveloper.message_queue_service.infrastructure.concerns.ProcessQueueOfMessagesOnBackgroundAdapter
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.servlet.MockMvc

import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.*
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.EventQueueConstants.LONGER_QUEUE_PROCESSING_LOOP_INTERVAL
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.NoteConstants.*
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.*
import static org.assertj.core.api.Assertions.assertThat
import static org.springframework.http.MediaType.APPLICATION_JSON
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
class SystemTest {
    @Autowired
    private MockMvc server
    private static UserRepository userRepository
    private static NoteRepository noteRepository

    @BeforeAll
    static void beforeAll() {
        userRepository = UserRepositoryFactory.getInstance()

        noteRepository = NoteRepositoryFactory.getInstance()
    }

    @BeforeEach
    void beforeEach() {
        try {
            userRepository.createUser(USER_OBJECT)
        } catch (Exception ignored) {
        }

        try {
            userRepository.updateUser(USER_OBJECT)
        } catch (Exception ignored) {
        }

        HttpClient.getDeleteRequestResponse(IN_MEMORY_SERVICE_URL + NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID)
    }

    @AfterEach
    void afterEach() {
        HttpClient.getDeleteRequestResponse(IN_MEMORY_SERVICE_URL + NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID)
    }

    @Test
    void testIfClientCanGetAllUsersFromDatabaseThroughHttpRequest() {
        String usersFromDatabase = JsonParser.getJsonStringOfObject(userRepository.getUsers())

        this.server
                .perform(get(USER_ROUTE + ROUTE_SEPARATOR_CHARACTER))
                .andExpect(status().isOk())
                .andExpect(content().string(usersFromDatabase.toString()))
    }

    @Test
    void testIfClientCanGetUserFromDatabaseThroughHttpRequest() {
        String userFromDatabase = JsonParser.getJsonStringOfObject(userRepository.getUser(USER_ID))

        this.server
                .perform(get(USER_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER))
                .andExpect(status().isOk())
                .andExpect(content().string(userFromDatabase.toString()))
    }

    @Test
    void testIfClientCanCreateUserOnDatabaseThroughHttpRequest() {
        userRepository.deleteUser(USER_ID)

        this.server
                .perform(
                        post(USER_ROUTE + ROUTE_SEPARATOR_CHARACTER)
                                .contentType(APPLICATION_JSON)
                                .content(USER_JSON)
                )
                .andExpect(status().isCreated())

        UserEntity user = userRepository.getUser(USER_ID)

        assertThat(user.id).isEqualTo(USER_OBJECT.id)
        assertThat(user.username).isEqualTo(USER_OBJECT.username)
    }

    @Test
    void testIfClientCanUpdateUserOnDatabaseThroughHttpRequest() {
        UserEntity userWithWrongData = new UserEntity(USER_ID, USER_USERNAME)

        userRepository.updateUser(userWithWrongData)

        this.server
                .perform(
                        patch(USER_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER)
                                .contentType(APPLICATION_JSON)
                                .content(USER_JSON)
                )
                .andExpect(status().isOk())

        UserEntity user = userRepository.getUser(USER_ID)

        assertThat(user.id).isEqualTo(USER_OBJECT.id)
        assertThat(user.username).isEqualTo(USER_OBJECT.username)
    }

    @Test
    void testIfClientCanDeleteUserOnDatabaseThroughHttpRequest() {
        this.server
                .perform(delete(USER_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER))
                .andExpect(status().isNoContent())

        try {
            userRepository.getUser(USER_ID)
        } catch (Exception exception) {
            assertThat(exception.message).isNotEmpty()
        }
    }

    @Test
    void testIfClientCanGetAllNotesFromDatabaseThroughHttpRequest() {
        ArrayList<NoteEntity> notesFromDatabase = noteRepository.getNotes(USER_ID)

        this.server
                .perform(get(NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER))
                .andExpect(status().isOk())
                .andExpect(content().string(notesFromDatabase.toString()))
    }

    @Test
    void testIfClientCanGetNoteFromDatabaseThroughHttpRequest() {
        noteRepository.createNote(NOTE_OBJECT)

        this.server
                .perform(get(NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID + ROUTE_SEPARATOR_CHARACTER))
                .andExpect(status().isOk())
                .andExpect(content().string(NOTE_JSON))
    }

    @Test
    void testIfClientCanCreateNoteOnDatabaseThroughHttpRequest() {
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
    }

    @Test
    void testIfClientCanUpdateNoteOnDatabaseThroughHttpRequest() {
        NoteEntity note =
                new NoteEntity(NOTE_ID, NOT_WANTED_NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        noteRepository.createNote(note)

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
    }

    @Test
    void testIfClientCanDeleteNoteOnDatabaseThroughHttpRequest() {
        NoteEntity note = new NoteEntity(NOTE_ID, NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        noteRepository.createNote(note)

        this.server
                .perform(delete(NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID + ROUTE_SEPARATOR_CHARACTER))
                .andExpect(status().isNoContent())

        try {
            noteRepository.getNote(NOTE_ID, USER_ID)
        } catch (Exception exception) {
            assertThat(exception.message).isNotEmpty()
        }
    }

    @Test
    void testIfQueueOfEventsIsProcessedAndAlterationsAreMadeOnDataSourceDatabase() {
        ProcessQueueOfMessagesOnBackgroundAdapter.processQueueOfMessagesOnBackground()

        this.server
                .perform(
                        post(NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER)
                                .contentType(APPLICATION_JSON)
                                .content(NOTE_JSON)
                )
                .andExpect(status().isCreated())

        sleep(LONGER_QUEUE_PROCESSING_LOOP_INTERVAL)

        NoteEntity note = HttpClient.getGetRequestResponse(
                DATA_SOURCE_SERVICE_URL + NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID,
                NoteEntity.class
        )
                .body

        assertThat(note.id).isEqualTo(NOTE_ID)
        assertThat(note.title).isEqualTo(NOTE_TITLE)
        assertThat(note.body).isEqualTo(NOTE_BODY)
        assertThat(note.createdAt).isEqualTo(NOTE_CREATED_AT)
        assertThat(note.updatedAt).isEqualTo(NOTE_UPDATED_AT)
        assertThat(note.userId).isEqualTo(USER_ID)
    }
}

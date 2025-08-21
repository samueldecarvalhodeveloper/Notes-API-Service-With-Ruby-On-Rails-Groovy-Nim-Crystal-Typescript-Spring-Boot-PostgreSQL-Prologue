package com.samueldecarvalhodeveloper.message_queue_service.unitaries.controllers

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

import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.ROUTE_SEPARATOR_CHARACTER
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.NoteConstants.*
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.getUSER_ID
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.getUSER_USERNAME
import static org.assertj.core.api.Assertions.assertThat
import static org.springframework.http.MediaType.APPLICATION_JSON
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
class NoteControllerTest {
    @Autowired
    private MockMvc server
    static private NoteRepository noteRepository
    static private UserRepository userRepository

    @BeforeAll
    static void beforeAll() {
        noteRepository = NoteRepositoryFactory.getInstance()
        userRepository = UserRepositoryFactory.getInstance()

        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        try {
            userRepository.createUser(user)
        } catch (Exception ignored) {
        }
    }

    @BeforeEach
    void beforeEach() {
        try {
            UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

            userRepository.createUser(user)
        } catch (Exception ignored) {
        }

        try {
            noteRepository.deleteNote(NOTE_ID, USER_ID)
        } catch (Exception ignored) {
        }
    }

    @AfterEach
    void afterEach() {
        try {
            noteRepository.deleteNote(NOTE_ID, USER_ID)
        } catch (Exception ignored) {
        }
    }

    @AfterAll
    static void afterAll() {
        userRepository.deleteUser(USER_ID)
    }

    @Test
    void testIfMethodGetNotesRespondsToClientAllUserNotesFromDatabase() {
        ArrayList<NoteEntity> notesFromDatabase = noteRepository.getNotes(USER_ID)

        this.server
                .perform(get(NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER))
                .andExpect(status().isOk())
                .andExpect(content().string(notesFromDatabase.toString()))
    }

    @Test
    void testIfMethodGetNotesRespondsToClientNotFoundIfUserDoesNotExist() {
        userRepository.deleteUser(USER_ID)

        this.server
                .perform(get(NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER))
                .andExpect(status().isNotFound())
    }

    @Test
    void testIfMethodGetNoteRespondsToClientNoteFromUserFromDatabase() {
        noteRepository.createNote(NOTE_OBJECT)

        this.server
                .perform(get(NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID + ROUTE_SEPARATOR_CHARACTER))
                .andExpect(status().isOk())
                .andExpect(content().string(NOTE_JSON))
    }

    @Test
    void testIfMethodGetNoteRespondsToClientNotFoundIfNoteDoesNotExist() {
        this.server
                .perform(get(NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID + ROUTE_SEPARATOR_CHARACTER))
                .andExpect(status().isNotFound())
    }

    @Test
    void testIfMethodCreateNoteCreatesNoteOnDatabase() {
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
    void testIfMethodCreateNoteRespondsToClientNotFoundIfUserDoesNotExistOnDatabase() {
        this.server
                .perform(
                        post(NOTE_ROUTE + NOT_EXISTING_USER_ID + ROUTE_SEPARATOR_CHARACTER)
                                .contentType(APPLICATION_JSON)
                                .content(NOT_EXISTING_USER_NOTE_JSON)
                )
                .andExpect(status().isNotFound())
    }

    @Test
    void testIfMethodCreateNoteRespondsToClientConflictIfNoteAlreadyExistsOnDatabase() {
        noteRepository.createNote(NOTE_OBJECT)

        this.server
                .perform(
                        post(NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER)
                                .contentType(APPLICATION_JSON)
                                .content(NOTE_JSON)
                )
                .andExpect(status().isConflict())
    }

    @Test
    void testIfMethodUpdateNoteUpdatesNoteOnDatabase() {
        NoteEntity note = new NoteEntity(NOTE_ID, NOT_WANTED_NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

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
    void testIfMethodUpdateNoteRespondsToClientNotFoundIfNoteDoesNotExistOnDatabase() {
        this.server
                .perform(
                        patch(NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID + ROUTE_SEPARATOR_CHARACTER)
                                .contentType(APPLICATION_JSON)
                                .content(NOTE_JSON)
                )
                .andExpect(status().isNotFound())
    }

    @Test
    void testIfMethodDeleteDeletesNotesOnDatabase() {
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
    void testIfMethodDeleteRespondsNotFoundIfNoteDoesNotExist() {
        this.server
                .perform(delete(NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID + ROUTE_SEPARATOR_CHARACTER))
                .andExpect(status().isNotFound())
    }
}
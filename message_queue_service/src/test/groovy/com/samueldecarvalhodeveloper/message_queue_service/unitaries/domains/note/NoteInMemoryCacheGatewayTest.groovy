package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.note

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.HttpClient
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteInMemoryCacheGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.entities.NoteEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserInMemoryCacheGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import org.junit.jupiter.api.*
import org.springframework.boot.test.context.SpringBootTest

import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.IN_MEMORY_SERVICE_URL
import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.ROUTE_SEPARATOR_CHARACTER
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.NoteConstants.*
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.*
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class NoteInMemoryCacheGatewayTest {
    private static NoteInMemoryCacheGateway noteInMemoryCacheGateway
    private static UserInMemoryCacheGateway userInMemoryCacheGateway

    @BeforeAll
    static void beforeAll() {
        noteInMemoryCacheGateway = new NoteInMemoryCacheGateway()
        userInMemoryCacheGateway = new UserInMemoryCacheGateway()
    }

    @BeforeEach
    void beforeEach() {
        try {
            UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

            userInMemoryCacheGateway.createUserOnInMemoryDatabase(user)
        } catch (Exception ignored) {
        }

        HttpClient
                .getDeleteRequestResponse(IN_MEMORY_SERVICE_URL + NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID)
    }

    @AfterEach
    void afterEach() {
        HttpClient
                .getDeleteRequestResponse(IN_MEMORY_SERVICE_URL + NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID)
    }

    @AfterAll
    static void afterAll() {
        try {
            userInMemoryCacheGateway.deleteUserOnInMemoryDatabase(USER_ID)
        } catch (Exception ignored) {
        }
    }

    @Test
    void testIfMethodGetNotesFromInMemoryDatabaseReturnsAllNotesFromUserFromDatabase() {
        ArrayList<NoteEntity> notesFromDatabase = HttpClient.getGetRequestResponse(
                IN_MEMORY_SERVICE_URL + NOTE_ROUTE + USER_ID,
                ArrayList<NoteEntity>.class
        ).body
        ArrayList<NoteEntity> notes = noteInMemoryCacheGateway.getNotesFromInMemoryDatabase(USER_ID)

        assertThat(notes).isEqualTo(notesFromDatabase)
    }

    @Test
    void testIfMethodGetNotesFromInMemoryDatabaseThrowsNotExistingUserErrorIfUserDoesNoteExist() {
        try {
            userInMemoryCacheGateway.deleteUserOnInMemoryDatabase(USER_ID)

            noteInMemoryCacheGateway.getNotesFromInMemoryDatabase(USER_ID)
        } catch (Exception exception) {
            assertThat(exception.message).isNotEmpty()
        }
    }

    @Test
    void testIfMethodGetNoteFromInMemoryDatabaseReturnsNoteFromUserFromDatabase() {
        NoteEntity note = new NoteEntity(NOTE_ID, NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        HttpClient.getPostRequestResponse(IN_MEMORY_SERVICE_URL + NOTE_ROUTE + USER_ID, note)

        NoteEntity retrievedNote = noteInMemoryCacheGateway.getNoteFromInMemoryDatabase(NOTE_ID, USER_ID)

        assertThat(retrievedNote.id).isEqualTo(NOTE_ID)
        assertThat(retrievedNote.title).isEqualTo(NOTE_TITLE)
        assertThat(retrievedNote.body).isEqualTo(NOTE_BODY)
        assertThat(retrievedNote.createdAt).isEqualTo(NOTE_CREATED_AT)
        assertThat(retrievedNote.updatedAt).isEqualTo(NOTE_UPDATED_AT)
        assertThat(retrievedNote.userId).isEqualTo(USER_ID)
    }

    @Test
    void testIfMethodGetNoteFromInMemoryDatabaseThrowsNotExistingNoteIfNoteDoesNotExist() {
        try {
            noteInMemoryCacheGateway.getNoteFromInMemoryDatabase(NOTE_ID, USER_ID)
        } catch (Exception exception) {
            assertThat(exception.message).isNotEmpty()
        }
    }

    @Test
    void testIfMethodCreateNoteOnInMemoryDatabaseCreatesNoteOnDatabase() {
        NoteEntity note = new NoteEntity(NOTE_ID, NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        noteInMemoryCacheGateway.createNoteOnInMemoryDatabase(note)

        NoteEntity retrievedNote =
                HttpClient.getGetRequestResponse(
                        IN_MEMORY_SERVICE_URL + NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID,
                        NoteEntity.class
                )
                        .body

        assertThat(retrievedNote.id).isEqualTo(NOTE_ID)
        assertThat(retrievedNote.title).isEqualTo(NOTE_TITLE)
        assertThat(retrievedNote.body).isEqualTo(NOTE_BODY)
        assertThat(retrievedNote.createdAt).isEqualTo(NOTE_CREATED_AT)
        assertThat(retrievedNote.updatedAt).isEqualTo(NOTE_UPDATED_AT)
        assertThat(retrievedNote.userId).isEqualTo(USER_ID)
    }

    @Test
    void testIfMethodCreateNoteOnInMemoryDatabaseThrowsNotExistingUserExceptionIfUserDoesNoteExist() {
        try {
            userInMemoryCacheGateway.deleteUserOnInMemoryDatabase(USER_ID)

            NoteEntity note = new NoteEntity(NOTE_ID, NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

            noteInMemoryCacheGateway.createNoteOnInMemoryDatabase(note)
        } catch (Exception exception) {
            assertThat(exception.message).isEqualTo(NOT_EXISTING_USER_EXCEPTION_MESSAGE)
        }
    }

    @Test
    void testIfMethodCreateNoteOnInMemoryDatabaseThrowsAlreadyExistingNoteExceptionIfNoteAlreadyExistOnDatabase() {
        try {
            NoteEntity note = new NoteEntity(NOTE_ID, NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

            HttpClient.getPostRequestResponse(IN_MEMORY_SERVICE_URL + NOTE_ROUTE + USER_ID, note)

            noteInMemoryCacheGateway.createNoteOnInMemoryDatabase(note)
        } catch (Exception exception) {
            assertThat(exception.message).isEqualTo(ALREADY_EXISTING_NOTE_EXCEPTION_MESSAGE)
        }
    }

    @Test
    void testIfMethodUpdateNoteOnInMemoryDatabaseUpdatesNoteOnDatabase() {
        NoteEntity note = new NoteEntity(NOTE_ID, NOT_WANTED_NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        HttpClient.getPostRequestResponse(IN_MEMORY_SERVICE_URL + NOTE_ROUTE + USER_ID, note)

        NoteEntity updatedNote = new NoteEntity(NOTE_ID, NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        noteInMemoryCacheGateway.updateNoteOnInMemoryDatabase(updatedNote)

        NoteEntity retrievedNote =
                HttpClient.getGetRequestResponse(
                        IN_MEMORY_SERVICE_URL + NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID,
                        NoteEntity.class
                )
                        .body

        assertThat(retrievedNote.id).isEqualTo(NOTE_ID)
        assertThat(retrievedNote.title).isEqualTo(NOTE_TITLE)
        assertThat(retrievedNote.body).isEqualTo(NOTE_BODY)
        assertThat(retrievedNote.createdAt).isEqualTo(NOTE_CREATED_AT)
        assertThat(retrievedNote.updatedAt).isEqualTo(NOTE_UPDATED_AT)
        assertThat(retrievedNote.userId).isEqualTo(USER_ID)
    }

    @Test
    void testIfMethodUpdateNoteOnInMemoryDatabaseThrowsNotExistingNoteExceptionIfNoteDoesNotExistOnDatabase() {
        try {
            NoteEntity note =
                    new NoteEntity(NOTE_ID, NOT_WANTED_NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

            noteInMemoryCacheGateway.updateNoteOnInMemoryDatabase(note)
        } catch (Exception exception) {
            assertThat(exception.message).isEqualTo(NOT_EXISTING_NOTE_EXCEPTION_MESSAGE)
        }
    }

    @Test
    void testIfMethodDeleteNoteOnInMemoryDatabaseDeletesNoteOnDatabase() {
        NoteEntity note = new NoteEntity(NOTE_ID, NOT_WANTED_NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        HttpClient.getPostRequestResponse(IN_MEMORY_SERVICE_URL + NOTE_ROUTE + USER_ID, note)

        noteInMemoryCacheGateway.deleteNoteOnInMemoryDatabase(NOTE_ID, USER_ID)

        try {
            HttpClient.getGetRequestResponse(
                    IN_MEMORY_SERVICE_URL + NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID,
                    NoteEntity.class
            )
        } catch (Exception exception) {
            assertThat(exception.message).isNotEmpty()
        }
    }

    @Test
    void testIfMethodDeleteNoteOnInMemoryDatabaseThrowsNotExistingNoteExceptionIfNoteDoesNotExist() {
        try {
            noteInMemoryCacheGateway.deleteNoteOnInMemoryDatabase(NOTE_ID, USER_ID)
        } catch (Exception exception) {
            assertThat(exception.message).isEqualTo(NOT_EXISTING_NOTE_EXCEPTION_MESSAGE)
        }
    }
}

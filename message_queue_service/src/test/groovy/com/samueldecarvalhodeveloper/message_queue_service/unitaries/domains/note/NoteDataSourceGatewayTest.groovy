package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.note

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.HttpClient
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteDataSourceGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.entities.NoteEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserDataSourceGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import org.junit.jupiter.api.*

import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.getDATA_SOURCE_SERVICE_URL
import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.getROUTE_SEPARATOR_CHARACTER
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.NoteConstants.*
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.getUSER_ID
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.getUSER_USERNAME
import static org.assertj.core.api.Assertions.assertThat

class NoteDataSourceGatewayTest {
    private static NoteDataSourceGateway noteDataSourceGateway
    private static UserDataSourceGateway userDataSourceGateway

    @BeforeAll
    static void beforeAll() {
        noteDataSourceGateway = new NoteDataSourceGateway()
        userDataSourceGateway = new UserDataSourceGateway()

        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        try {
            userDataSourceGateway.createUserOnDataSourceDatabase(user)
        } catch (Exception ignored) {
        }
    }

    @BeforeEach
    void beforeEach() {
        HttpClient
                .getDeleteRequestResponse(DATA_SOURCE_SERVICE_URL + NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID)
    }

    @AfterEach
    void afterEach() {
        HttpClient
                .getDeleteRequestResponse(DATA_SOURCE_SERVICE_URL + NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID)
    }

    @AfterAll
    static void afterAll() {
        try {
            userDataSourceGateway.deleteUserOnDataSourceDatabase(USER_ID)
        } catch (Exception ignored) {
        }
    }

    @Test
    void testIfMethodCreateNoteOnDataSourceDatabaseCreatesNoteOnDatabase() {
        NoteEntity note = new NoteEntity(NOTE_ID, NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        noteDataSourceGateway.createNoteOnDataSourceDatabase(note)

        NoteEntity retrievedNote =
                HttpClient.getGetRequestResponse(
                        DATA_SOURCE_SERVICE_URL + NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID,
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
    void testIfMethodUpdateNoteOnDataSourceDatabaseUpdatesNoteOnDatabase() {
        NoteEntity note = new NoteEntity(NOTE_ID, NOT_WANTED_NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        HttpClient.getPostRequestResponse(DATA_SOURCE_SERVICE_URL + NOTE_ROUTE + USER_ID, note)

        NoteEntity updatedNote = new NoteEntity(NOTE_ID, NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        noteDataSourceGateway.updateNoteOnDataSourceDatabase(updatedNote)

        NoteEntity retrievedNote =
                HttpClient.getGetRequestResponse(
                        DATA_SOURCE_SERVICE_URL + NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID,
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
    void testIfMethodDeleteNoteOnDataSourceDatabaseDeletesNoteOnDatabase() {
        NoteEntity note = new NoteEntity(NOTE_ID, NOT_WANTED_NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        HttpClient.getPostRequestResponse(DATA_SOURCE_SERVICE_URL + NOTE_ROUTE + USER_ID, note)

        noteDataSourceGateway.deleteNoteOnDataSourceDatabase(NOTE_ID, USER_ID)

        try {
            HttpClient.getGetRequestResponse(
                    DATA_SOURCE_SERVICE_URL + NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID,
                    NoteEntity.class
            )
                    .body
        } catch (Exception exception) {
            assertThat(exception.message).isNotEmpty()
        }
    }
}

package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.note

import com.samueldecarvalhodeveloper.message_queue_service.domains.event_queue.EventQueue
import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.HttpClient
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteActiveRecord
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteDataSourceGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteInMemoryCacheGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.entities.NoteEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserInMemoryCacheGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import org.junit.jupiter.api.*
import org.springframework.boot.test.context.SpringBootTest

import java.lang.reflect.Field

import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.IN_MEMORY_SERVICE_URL
import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.ROUTE_SEPARATOR_CHARACTER
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.EventQueueConstants.getQUEUE_OF_EVENTS_CLASS_ATTRIBUTE
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.NoteConstants.*
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.USER_ID
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.USER_USERNAME
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class NoteActiveRecordTest {
    private static NoteActiveRecord noteActiveRecord
    private static NoteInMemoryCacheGateway noteInMemoryCacheGateway
    private static UserInMemoryCacheGateway userInMemoryCacheGateway

    @BeforeAll
    static void beforeAll() {
        noteInMemoryCacheGateway = new NoteInMemoryCacheGateway()
        NoteDataSourceGateway noteDataSourceGateway = new NoteDataSourceGateway()

        noteActiveRecord = new NoteActiveRecord(noteDataSourceGateway, noteInMemoryCacheGateway)

        userInMemoryCacheGateway = new UserInMemoryCacheGateway()

        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        userInMemoryCacheGateway.createUserOnInMemoryDatabase(user)
    }

    @BeforeEach
    void beforeEach() {
        HttpClient
                .getDeleteRequestResponse(IN_MEMORY_SERVICE_URL + NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID)
    }

    @AfterEach
    void afterEach() {
        HttpClient
                .getDeleteRequestResponse(IN_MEMORY_SERVICE_URL + NOTE_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + NOTE_ID)

        Field queueOfEventsClassAttribute = EventQueue.getDeclaredField(QUEUE_OF_EVENTS_CLASS_ATTRIBUTE)

        queueOfEventsClassAttribute.setAccessible(true)

        (queueOfEventsClassAttribute.get(null) as LinkedList<Closure<Void>>).clear()
    }

    @AfterAll
    static void afterAll() {
        userInMemoryCacheGateway.deleteUserOnInMemoryDatabase(USER_ID)
    }

    @Test
    void testIfMethodGetNotesFromDatabaseReturnsAllNotesFromUserFromDatabase() {
        ArrayList<NoteEntity> notes = noteActiveRecord.getNotesFromDatabase(USER_ID)

        assertThat(notes).isEqualTo([])
    }

    @Test
    void testIfMethodGetNoteFromDatabaseReturnsNoteFromUserFromDatabase() {
        NoteEntity note = new NoteEntity(NOTE_ID, NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        noteInMemoryCacheGateway.createNoteOnInMemoryDatabase(note)

        NoteEntity retrievedNote = noteActiveRecord.getNoteFromDatabase(NOTE_ID, USER_ID)

        assertThat(retrievedNote.id).isEqualTo(NOTE_ID)
        assertThat(retrievedNote.title).isEqualTo(NOTE_TITLE)
        assertThat(retrievedNote.body).isEqualTo(NOTE_BODY)
        assertThat(retrievedNote.createdAt).isEqualTo(NOTE_CREATED_AT)
        assertThat(retrievedNote.updatedAt).isEqualTo(NOTE_UPDATED_AT)
        assertThat(retrievedNote.userId).isEqualTo(USER_ID)
    }

    @Test
    void testIfMethodCreateNoteOnDatabaseCreatesNoteOnDatabase() {
        NoteEntity note = new NoteEntity(NOTE_ID, NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        noteActiveRecord.createNoteOnDatabase(note)

        NoteEntity retrievedNote = noteInMemoryCacheGateway.getNoteFromInMemoryDatabase(NOTE_ID, USER_ID)

        assertThat(retrievedNote.id).isEqualTo(NOTE_ID)
        assertThat(retrievedNote.title).isEqualTo(NOTE_TITLE)
        assertThat(retrievedNote.body).isEqualTo(NOTE_BODY)
        assertThat(retrievedNote.createdAt).isEqualTo(NOTE_CREATED_AT)
        assertThat(retrievedNote.updatedAt).isEqualTo(NOTE_UPDATED_AT)
        assertThat(retrievedNote.userId).isEqualTo(USER_ID)

        Field queueOfEventsClassAttribute = EventQueue.getDeclaredField(QUEUE_OF_EVENTS_CLASS_ATTRIBUTE)

        queueOfEventsClassAttribute.setAccessible(true)

        assertThat((queueOfEventsClassAttribute.get(null) as LinkedList<Closure<Void>>).size()).isEqualTo(1)
    }

    @Test
    void testIfMethodUpdateNoteOnDatabaseUpdatesNoteOnDatabase() {
        NoteEntity note = new NoteEntity(NOTE_ID, NOT_WANTED_NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        noteInMemoryCacheGateway.createNoteOnInMemoryDatabase(note)

        NoteEntity updatedNote = new NoteEntity(NOTE_ID, NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        noteActiveRecord.updateNoteOnDatabase(updatedNote)

        NoteEntity retrievedNote = noteInMemoryCacheGateway.getNoteFromInMemoryDatabase(NOTE_ID, USER_ID)

        assertThat(retrievedNote.id).isEqualTo(NOTE_ID)
        assertThat(retrievedNote.title).isEqualTo(NOTE_TITLE)
        assertThat(retrievedNote.body).isEqualTo(NOTE_BODY)
        assertThat(retrievedNote.createdAt).isEqualTo(NOTE_CREATED_AT)
        assertThat(retrievedNote.updatedAt).isEqualTo(NOTE_UPDATED_AT)
        assertThat(retrievedNote.userId).isEqualTo(USER_ID)

        Field queueOfEventsClassAttribute = EventQueue.getDeclaredField(QUEUE_OF_EVENTS_CLASS_ATTRIBUTE)

        queueOfEventsClassAttribute.setAccessible(true)

        assertThat((queueOfEventsClassAttribute.get(null) as LinkedList<Closure<Void>>).size()).isEqualTo(1)
    }

    @Test
    void testIfMethodDeleteNoteOnDatabaseDeletesNoteOnDatabase() {
        NoteEntity note = new NoteEntity(NOTE_ID, NOT_WANTED_NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        noteInMemoryCacheGateway.createNoteOnInMemoryDatabase(note)

        noteActiveRecord.deleteNoteOnDatabase(NOTE_ID, USER_ID)

        try {
            noteInMemoryCacheGateway.getNoteFromInMemoryDatabase(NOTE_ID, USER_ID)
        } catch (Exception exception) {
            assertThat(exception.message).isNotEmpty()
        }

        Field queueOfEventsClassAttribute = EventQueue.getDeclaredField(QUEUE_OF_EVENTS_CLASS_ATTRIBUTE)

        queueOfEventsClassAttribute.setAccessible(true)

        assertThat((queueOfEventsClassAttribute.get(null) as LinkedList<Closure<Void>>).size()).isEqualTo(1)
    }
}

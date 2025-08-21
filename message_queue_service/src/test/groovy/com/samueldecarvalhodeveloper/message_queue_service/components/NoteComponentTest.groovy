package com.samueldecarvalhodeveloper.message_queue_service.components

import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteActiveRecord
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteDataSourceGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteInMemoryCacheGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteRepository
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.entities.NoteEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserActiveRecord
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserDataSourceGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserInMemoryCacheGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserRepository
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import org.junit.jupiter.api.*
import org.springframework.boot.test.context.SpringBootTest

import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.NoteConstants.*
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.getUSER_ID
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.getUSER_USERNAME
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class NoteComponentTest {
    static private NoteRepository noteRepository
    static private NoteInMemoryCacheGateway noteInMemoryCacheGateway
    static private UserRepository userRepository

    @BeforeAll
    static void beforeAll() {
        UserDataSourceGateway userDataSourceGateway = new UserDataSourceGateway()
        UserInMemoryCacheGateway userInMemoryCacheGateway = new UserInMemoryCacheGateway()
        UserActiveRecord userActiveRecord = new UserActiveRecord(userDataSourceGateway, userInMemoryCacheGateway)

        noteInMemoryCacheGateway = new NoteInMemoryCacheGateway()
        NoteDataSourceGateway noteDataSourceGateway = new NoteDataSourceGateway()

        NoteActiveRecord noteActiveRecord = new NoteActiveRecord(noteDataSourceGateway, noteInMemoryCacheGateway)

        noteRepository = new NoteRepository(noteActiveRecord)

        userRepository = new UserRepository(userActiveRecord)

        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        userRepository.createUser(user)
    }

    @BeforeEach
    void beforeEach() {
        try {
            noteInMemoryCacheGateway.deleteNoteOnInMemoryDatabase(NOTE_ID, USER_ID)
        } catch (Exception ignored) {
        }
    }

    @AfterEach
    void afterEach() {
        try {
            noteInMemoryCacheGateway.deleteNoteOnInMemoryDatabase(NOTE_ID, USER_ID)
        } catch (Exception ignored) {
        }
    }

    @AfterAll
    static void afterAll() {
        userRepository.deleteUser(USER_ID)
    }

    @Test
    void testFetchingAllNotesFromDatabase() {
        ArrayList<NoteEntity> notesFromDatabase = noteInMemoryCacheGateway.getNotesFromInMemoryDatabase(USER_ID)

        ArrayList<NoteEntity> notes = noteRepository.getNotes(USER_ID)

        assertThat(notes).isEqualTo(notesFromDatabase)
    }

    @Test
    void testFetchingNoteFromDatabase() {
        NoteEntity note = new NoteEntity(NOTE_ID, NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        noteInMemoryCacheGateway.createNoteOnInMemoryDatabase(note)

        NoteEntity retrievedNote = noteRepository.getNote(NOTE_ID, USER_ID)

        assertThat(retrievedNote.id).isEqualTo(NOTE_ID)
        assertThat(retrievedNote.title).isEqualTo(NOTE_TITLE)
        assertThat(retrievedNote.body).isEqualTo(NOTE_BODY)
        assertThat(retrievedNote.createdAt).isEqualTo(NOTE_CREATED_AT)
        assertThat(retrievedNote.updatedAt).isEqualTo(NOTE_UPDATED_AT)
        assertThat(retrievedNote.userId).isEqualTo(USER_ID)
    }

    @Test
    void testCreatingNoteOnDatabase() {
        NoteEntity note = new NoteEntity(NOTE_ID, NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        noteRepository.createNote(note)

        NoteEntity retrievedNote = noteInMemoryCacheGateway.getNoteFromInMemoryDatabase(NOTE_ID, USER_ID)

        assertThat(retrievedNote.id).isEqualTo(NOTE_ID)
        assertThat(retrievedNote.title).isEqualTo(NOTE_TITLE)
        assertThat(retrievedNote.body).isEqualTo(NOTE_BODY)
        assertThat(retrievedNote.createdAt).isEqualTo(NOTE_CREATED_AT)
        assertThat(retrievedNote.updatedAt).isEqualTo(NOTE_UPDATED_AT)
        assertThat(retrievedNote.userId).isEqualTo(USER_ID)
    }

    @Test
    void testUpdatingNoteOnDatabase() {
        NoteEntity note = new NoteEntity(NOTE_ID, NOT_WANTED_NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        noteInMemoryCacheGateway.createNoteOnInMemoryDatabase(note)

        NoteEntity updatedNote = new NoteEntity(NOTE_ID, NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        noteRepository.updateNote(updatedNote)

        NoteEntity retrievedNote = noteInMemoryCacheGateway.getNoteFromInMemoryDatabase(NOTE_ID, USER_ID)

        assertThat(retrievedNote.id).isEqualTo(NOTE_ID)
        assertThat(retrievedNote.title).isEqualTo(NOTE_TITLE)
        assertThat(retrievedNote.body).isEqualTo(NOTE_BODY)
        assertThat(retrievedNote.createdAt).isEqualTo(NOTE_CREATED_AT)
        assertThat(retrievedNote.updatedAt).isEqualTo(NOTE_UPDATED_AT)
        assertThat(retrievedNote.userId).isEqualTo(USER_ID)
    }

    @Test
    void testDeletingNoteFromDatabase() {
        NoteEntity note = new NoteEntity(NOTE_ID, NOT_WANTED_NOTE_TITLE, NOTE_BODY, NOTE_CREATED_AT, NOTE_UPDATED_AT, USER_ID)

        noteInMemoryCacheGateway.createNoteOnInMemoryDatabase(note)

        noteRepository.deleteNote(NOTE_ID, USER_ID)

        try {
            noteInMemoryCacheGateway.getNoteFromInMemoryDatabase(NOTE_ID, USER_ID)
        } catch (Exception exception) {
            assertThat(exception.message).isNotEmpty()
        }
    }
}

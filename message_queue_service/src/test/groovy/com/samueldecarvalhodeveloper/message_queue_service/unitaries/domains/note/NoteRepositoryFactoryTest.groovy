package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.note

import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteInMemoryCacheGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteRepository
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteRepositoryFactory
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.entities.NoteEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserActiveRecord
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserDataSourceGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserInMemoryCacheGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserRepository
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.USER_ID
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.USER_USERNAME
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class NoteRepositoryFactoryTest {
    static private UserRepository userRepository
    static private NoteInMemoryCacheGateway noteInMemoryCacheGateway

    @BeforeAll
    static void beforeAll() {
        UserDataSourceGateway userDataSourceGateway = new UserDataSourceGateway()
        UserInMemoryCacheGateway userInMemoryCacheGateway = new UserInMemoryCacheGateway()
        UserActiveRecord userActiveRecord = new UserActiveRecord(userDataSourceGateway, userInMemoryCacheGateway)

        noteInMemoryCacheGateway = new NoteInMemoryCacheGateway()

        userRepository = new UserRepository(userActiveRecord)

        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        userRepository.createUser(user)
    }

    @AfterAll
    static void afterAll() {
        userRepository.deleteUser(USER_ID)
    }

    @Test
    void testIfMethodReturnsAClassInstance() {
        ArrayList<NoteEntity> notesFromDatabase = noteInMemoryCacheGateway.getNotesFromInMemoryDatabase(USER_ID)

        NoteRepository noteRepository = NoteRepositoryFactory.getInstance()

        ArrayList<NoteEntity> notes = noteRepository.getNotes(USER_ID)

        assertThat(notes).isEqualTo(notesFromDatabase)
    }
}

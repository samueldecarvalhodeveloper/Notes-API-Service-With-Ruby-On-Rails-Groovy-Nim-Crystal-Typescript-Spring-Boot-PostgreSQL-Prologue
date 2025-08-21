package com.samueldecarvalhodeveloper.message_queue_service.components

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.HttpClient
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserActiveRecord
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserDataSourceGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserInMemoryCacheGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserRepository
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.getIN_MEMORY_SERVICE_URL
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.*
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class UserComponentTest {
    private static UserActiveRecord userActiveRecord

    private static UserRepository userRepository

    @BeforeAll
    static void beforeAll() {
        UserInMemoryCacheGateway userInMemoryCacheGateway = new UserInMemoryCacheGateway()

        UserDataSourceGateway userDataSourceGateway = new UserDataSourceGateway()

        userActiveRecord = new UserActiveRecord(userDataSourceGateway, userInMemoryCacheGateway)

        userRepository = new UserRepository(userActiveRecord)
    }

    @BeforeEach
    void beforeEach() {
        HttpClient.getDeleteRequestResponse(IN_MEMORY_SERVICE_URL + USER_ROUTE + USER_ID)
    }

    @AfterEach
    void afterEach() {
        HttpClient.getDeleteRequestResponse(IN_MEMORY_SERVICE_URL + USER_ROUTE + USER_ID)
    }

    @Test
    void testFetchingAllUserFromDatabase() {
        ArrayList<UserEntity> usersFromDatabase = userActiveRecord.getUsersFromDatabase()

        ArrayList<UserEntity> users = userRepository.getUsers()

        assertThat(users).isEqualTo(usersFromDatabase)
    }

    @Test
    void testFetchingUserFromDatabase() {
        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        userActiveRecord.createUserOnDatabase(user)

        UserEntity retrievedUser = userRepository.getUser(USER_ID)

        assertThat(retrievedUser.id).isEqualTo(USER_ID)
        assertThat(retrievedUser.username).isEqualTo(USER_USERNAME)
    }

    @Test
    void testCreatingUserOnDatabase() {
        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        userRepository.createUser(user)

        UserEntity retrievedUser = userActiveRecord.getUserFromDatabase(USER_ID)

        assertThat(retrievedUser.id).isEqualTo(USER_ID)
        assertThat(retrievedUser.username).isEqualTo(USER_USERNAME)
    }

    @Test
    void testUpdatingUserOnDatabase() {
        UserEntity user = new UserEntity(USER_ID, NOT_WANTED_USER_USERNAME)

        userActiveRecord.createUserOnDatabase(user)


        UserEntity updatedUser = new UserEntity(USER_ID, USER_USERNAME)

        userRepository.updateUser(updatedUser)

        UserEntity retrievedUser = userActiveRecord.getUserFromDatabase(USER_ID)

        assertThat(retrievedUser.id).isEqualTo(USER_ID)
        assertThat(retrievedUser.username).isEqualTo(USER_USERNAME)
    }

    @Test
    void testDeletingUserOnDatabase() {
        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        userActiveRecord.createUserOnDatabase(user)

        userRepository.deleteUser(USER_ID)

        try {
            userActiveRecord.getUserFromDatabase(USER_ID)
        } catch (Exception exception) {
            assertThat(exception.message).isNotEmpty()
        }
    }
}

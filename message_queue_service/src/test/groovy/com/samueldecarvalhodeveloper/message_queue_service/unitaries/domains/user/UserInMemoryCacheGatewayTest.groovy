package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.user

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.HttpClient
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserInMemoryCacheGateway
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
class UserInMemoryCacheGatewayTest {
    private static UserInMemoryCacheGateway userInMemoryCacheGateway

    @BeforeAll
    static void beforeAll() {
        userInMemoryCacheGateway = new UserInMemoryCacheGateway()
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
    void testIfMethodGetUsersFromInMemoryDatabaseReturnsAllUsersFromDatabase() {
        ArrayList<UserEntity> usersFromDatabase =
                HttpClient.getGetRequestResponse(IN_MEMORY_SERVICE_URL + USER_ROUTE, ArrayList<UserEntity>.class).body

        ArrayList<UserEntity> users = userInMemoryCacheGateway.getUsersFromInMemoryDatabase()

        assertThat(users).isEqualTo(usersFromDatabase)
    }

    @Test
    void testIfMethodGetUserFromInMemoryDatabaseReturnsUserFromDatabase() {
        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        HttpClient.getPostRequestResponse(
                IN_MEMORY_SERVICE_URL + USER_ROUTE,
                user
        )

        UserEntity users = userInMemoryCacheGateway.getUserFromInMemoryDatabase(USER_ID)

        assertThat(users.id).isEqualTo(USER_ID)
        assertThat(users.username).isEqualTo(USER_USERNAME)
    }

    @Test
    void testIfMethodGetUserFromInMemoryDatabaseThrowsNotExistingUserExceptionIfUserDoesNotExistOnDatabase() {
        try {
            userInMemoryCacheGateway.getUserFromInMemoryDatabase(USER_ID)
        } catch (Exception exception) {
            assertThat(exception.message).isEqualTo(NOT_EXISTING_USER_EXCEPTION_MESSAGE)
        }
    }

    @Test
    void testIfMethodCreateUserOnInMemoryDatabaseCreatesUserOnDatabase() {
        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        userInMemoryCacheGateway.createUserOnInMemoryDatabase(user)

        UserEntity userFromDatabase =
                HttpClient.getGetRequestResponse(IN_MEMORY_SERVICE_URL + USER_ROUTE + USER_ID, UserEntity.class).body

        assertThat(userFromDatabase.id).isEqualTo(USER_ID)
        assertThat(userFromDatabase.username).isEqualTo(USER_USERNAME)
    }

    @Test
    void testIfMethodCreateUserOnInMemoryDatabaseThrowsAlreadyExistingUserExceptionIfUserAlreadyExistsOnDatabase() {
        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        HttpClient.getPostRequestResponse(
                IN_MEMORY_SERVICE_URL + USER_ROUTE,
                user
        )

        try {
            userInMemoryCacheGateway.createUserOnInMemoryDatabase(user)
        } catch (Exception exception) {
            assertThat(exception.message).isEqualTo(ALREADY_EXISTING_USER_EXCEPTION_MESSAGE)
        }
    }

    @Test
    void testIfMethodUpdateUserOnInMemoryDatabaseUpdatesUserOnDatabase() {
        UserEntity user = new UserEntity(USER_ID, NOT_WANTED_USER_USERNAME)

        HttpClient.getPostRequestResponse(
                IN_MEMORY_SERVICE_URL + USER_ROUTE,
                user
        )

        UserEntity updatedUser = new UserEntity(USER_ID, USER_USERNAME)

        userInMemoryCacheGateway.updateUserOnInMemoryDatabase(updatedUser)

        UserEntity userWithNewDataFromDatabase =
                HttpClient.getGetRequestResponse(IN_MEMORY_SERVICE_URL + USER_ROUTE + USER_ID, UserEntity.class).body

        assertThat(userWithNewDataFromDatabase.id).isEqualTo(USER_ID)
        assertThat(userWithNewDataFromDatabase.username).isEqualTo(USER_USERNAME)
    }

    @Test
    void testIfMethodUpdateUserOnInMemoryDatabaseThrowsNotExistingUserIfUserDoesNotExistOnDatabase() {
        try {
            UserEntity updatedUser = new UserEntity(USER_ID, USER_USERNAME)

            userInMemoryCacheGateway.updateUserOnInMemoryDatabase(updatedUser)
        } catch (Exception exception) {
            assertThat(exception.message).isEqualTo(NOT_EXISTING_USER_EXCEPTION_MESSAGE)
        }
    }

    @Test
    void testIfMethodDeleteUserOnInMemoryDatabaseDeletesUserOnDatabase() {
        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        HttpClient.getPostRequestResponse(
                IN_MEMORY_SERVICE_URL + USER_ROUTE,
                user
        )

        userInMemoryCacheGateway.deleteUserOnInMemoryDatabase(USER_ID)

        try {
            HttpClient.getGetRequestResponse(
                    IN_MEMORY_SERVICE_URL + USER_ROUTE + USER_ID,
                    UserEntity.class
            )
        } catch (Exception exception) {
            assertThat(exception.message).isNotEmpty()
        }
    }

    @Test
    void testIfMethodDeleteUserOnInMemoryDatabaseThrowsNotExistingUserExceptionIfUserDoesNotExistOnDatabase() {
        try {
            userInMemoryCacheGateway.deleteUserOnInMemoryDatabase(USER_ID)
        } catch (Exception exception) {
            assertThat(exception.message).isEqualTo(NOT_EXISTING_USER_EXCEPTION_MESSAGE)
        }
    }
}

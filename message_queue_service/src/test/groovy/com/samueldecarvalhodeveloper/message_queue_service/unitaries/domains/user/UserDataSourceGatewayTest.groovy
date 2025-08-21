package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.user

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.HttpClient
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserDataSourceGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.DATA_SOURCE_SERVICE_URL
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.*
import static org.assertj.core.api.Assertions.assertThat

class UserDataSourceGatewayTest {
    private static UserDataSourceGateway userDataSourceGateway

    @BeforeAll
    static void beforeAll() {
        userDataSourceGateway = new UserDataSourceGateway()
    }

    @BeforeEach
    void beforeEach() {
        HttpClient.getDeleteRequestResponse(DATA_SOURCE_SERVICE_URL + USER_ROUTE + USER_ID)
    }

    @AfterEach
    void afterEach() {
        HttpClient.getDeleteRequestResponse(DATA_SOURCE_SERVICE_URL + USER_ROUTE + USER_ID)
    }

    @Test
    void testIfMethodCreateUserOnDataSourceDatabaseCreatesUserOnDatabase() {
        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        userDataSourceGateway.createUserOnDataSourceDatabase(user)

        UserEntity userFromDatabase =
                HttpClient.getGetRequestResponse(DATA_SOURCE_SERVICE_URL + USER_ROUTE + USER_ID, UserEntity.class).body

        assertThat(userFromDatabase.id).isEqualTo(USER_ID)
        assertThat(userFromDatabase.username).isEqualTo(USER_USERNAME)
    }

    @Test
    void testIfMethodUpdateUserOnDataSourceDatabaseUpdatesUserOnDatabase() {
        UserEntity user = new UserEntity(USER_ID, NOT_WANTED_USER_USERNAME)

        HttpClient.getPostRequestResponse(
                DATA_SOURCE_SERVICE_URL + USER_ROUTE,
                user
        )

        UserEntity updatedUser = new UserEntity(USER_ID, USER_USERNAME)

        userDataSourceGateway.updateUserOnDataSourceDatabase(updatedUser)

        UserEntity userWithNewDataFromDatabase =
                HttpClient.getGetRequestResponse(DATA_SOURCE_SERVICE_URL + USER_ROUTE + USER_ID, UserEntity.class).body

        assertThat(userWithNewDataFromDatabase.id).isEqualTo(USER_ID)
        assertThat(userWithNewDataFromDatabase.username).isEqualTo(USER_USERNAME)
    }

    @Test
    void testIfMethodDeleteNoteOnInMemoryDatabaseDeletesUserOnDatabase() {
        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        HttpClient.getPostRequestResponse(
                DATA_SOURCE_SERVICE_URL + USER_ROUTE,
                user
        )

        userDataSourceGateway.deleteUserOnDataSourceDatabase(USER_ID)

        try {
            HttpClient.getGetRequestResponse(
                    DATA_SOURCE_SERVICE_URL + USER_ROUTE + USER_ID,
                    UserEntity.class
            )
        } catch (Exception exception) {
            assertThat(exception.message).isNotEmpty()
        }
    }
}

package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.user

import com.samueldecarvalhodeveloper.message_queue_service.domains.event_queue.EventQueue
import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.HttpClient
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserActiveRecord
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserDataSourceGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserInMemoryCacheGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

import java.lang.reflect.Field

import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.IN_MEMORY_SERVICE_URL
import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.getDATA_SOURCE_SERVICE_URL
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.EventQueueConstants.getQUEUE_OF_EVENTS_CLASS_ATTRIBUTE
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.*
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class UserActiveRecordTest {
    private static UserActiveRecord userActiveRecord

    private static UserInMemoryCacheGateway userInMemoryCacheGateway

    @BeforeAll
    static void beforeAll() {
        userInMemoryCacheGateway = new UserInMemoryCacheGateway()

        UserDataSourceGateway userDataSourceGateway = new UserDataSourceGateway()

        userActiveRecord = new UserActiveRecord(userDataSourceGateway, userInMemoryCacheGateway)
    }

    @BeforeEach
    void beforeEach() {
        HttpClient.getDeleteRequestResponse(IN_MEMORY_SERVICE_URL + USER_ROUTE + USER_ID)

        HttpClient.getDeleteRequestResponse(DATA_SOURCE_SERVICE_URL + USER_ROUTE + USER_ID)

        Field queueOfEventsClassAttribute = EventQueue.getDeclaredField(QUEUE_OF_EVENTS_CLASS_ATTRIBUTE)

        queueOfEventsClassAttribute.setAccessible(true)

        (queueOfEventsClassAttribute.get(null) as LinkedList<Closure<Void>>).clear()
    }

    @AfterEach
    void afterEach() {
        HttpClient.getDeleteRequestResponse(IN_MEMORY_SERVICE_URL + USER_ROUTE + USER_ID)

        HttpClient.getDeleteRequestResponse(DATA_SOURCE_SERVICE_URL + USER_ROUTE + USER_ID)

        Field queueOfEventsClassAttribute = EventQueue.getDeclaredField(QUEUE_OF_EVENTS_CLASS_ATTRIBUTE)

        queueOfEventsClassAttribute.setAccessible(true)

        (queueOfEventsClassAttribute.get(null) as LinkedList<Closure<Void>>).clear()
    }

    @Test
    void testIfMethodGetUsersFromDatabaseReturnsAllUsersFromDatabase() {
        ArrayList<UserEntity> usersFromDatabase =
                HttpClient.getGetRequestResponse(IN_MEMORY_SERVICE_URL + USER_ROUTE, ArrayList<UserEntity>.class).body

        ArrayList<UserEntity> users = userActiveRecord.getUsersFromDatabase()

        assertThat(users).isEqualTo(usersFromDatabase)
    }

    @Test
    void testIfMethodGetUserFromDatabaseReturnsUserFromDatabase() {
        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        userInMemoryCacheGateway.createUserOnInMemoryDatabase(user)

        UserEntity retrievedUser = userActiveRecord.getUserFromDatabase(USER_ID)

        assertThat(retrievedUser.id).isEqualTo(USER_ID)
        assertThat(retrievedUser.username).isEqualTo(USER_USERNAME)

        Field queueOfEventsClassAttribute = EventQueue.getDeclaredField(QUEUE_OF_EVENTS_CLASS_ATTRIBUTE)

        queueOfEventsClassAttribute.setAccessible(true)
    }

    @Test
    void testIfMethodCreateUserOnDatabaseCreatesUserOnInMemoryDatabaseAndAddsUserCreatingEventInDataSourceToEventQueue() {
        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        userActiveRecord.createUserOnDatabase(user)

        UserEntity retrievedUser = userInMemoryCacheGateway.getUserFromInMemoryDatabase(USER_ID)

        assertThat(retrievedUser.id).isEqualTo(USER_ID)
        assertThat(retrievedUser.username).isEqualTo(USER_USERNAME)

        Field queueOfEventsClassAttribute = EventQueue.getDeclaredField(QUEUE_OF_EVENTS_CLASS_ATTRIBUTE)

        queueOfEventsClassAttribute.setAccessible(true)

        assertThat((queueOfEventsClassAttribute.get(null) as LinkedList<Closure<Void>>).size()).isEqualTo(1)
    }

    @Test
    void testIfMethodUpdateUserOnDatabaseUpdatesUserOnInMemoryDatabaseAndAddsUserUpdatingEventInDataSourceToEventQueue() {
        UserEntity user = new UserEntity(USER_ID, NOT_WANTED_USER_USERNAME)

        userInMemoryCacheGateway.createUserOnInMemoryDatabase(user)

        UserEntity updatedUser = new UserEntity(USER_ID, USER_USERNAME)

        userActiveRecord.updateUserOnDatabase(updatedUser)

        UserEntity retrievedUser = userInMemoryCacheGateway.getUserFromInMemoryDatabase(USER_ID)

        assertThat(retrievedUser.id).isEqualTo(USER_ID)
        assertThat(retrievedUser.username).isEqualTo(USER_USERNAME)

        Field queueOfEventsClassAttribute = EventQueue.getDeclaredField(QUEUE_OF_EVENTS_CLASS_ATTRIBUTE)

        queueOfEventsClassAttribute.setAccessible(true)

        assertThat((queueOfEventsClassAttribute.get(null) as LinkedList<Closure<Void>>).size()).isEqualTo(1)
    }

    @Test
    void testIfMethodDeleteUserOnDatabaseDeletesUserOnInMemoryDatabaseAndAddsUserDeletingEventInDataSourceToEventQueue() {
        UserEntity user = new UserEntity(USER_ID, NOT_WANTED_USER_USERNAME)

        userInMemoryCacheGateway.createUserOnInMemoryDatabase(user)

        userActiveRecord.deleteUserOnDatabase(USER_ID)

        try {
            userInMemoryCacheGateway.getUserFromInMemoryDatabase(USER_ID)
        } catch (Exception exception) {
            assertThat(exception.message).isNotEmpty()
        }

        Field queueOfEventsClassAttribute = EventQueue.getDeclaredField(QUEUE_OF_EVENTS_CLASS_ATTRIBUTE)

        queueOfEventsClassAttribute.setAccessible(true)

        assertThat((queueOfEventsClassAttribute.get(null) as LinkedList<Closure<Void>>).size()).isEqualTo(1)
    }
}

package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.user

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.HttpClient
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserRepository
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserRepositoryFactory
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.IN_MEMORY_SERVICE_URL
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.USER_ROUTE
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class UserRepositoryFactoryTest {
    @Test
    void testIfMethodReturnsAClassInstance() {
        ArrayList<UserEntity> usersFromDatabase =
                HttpClient.getGetRequestResponse(IN_MEMORY_SERVICE_URL + USER_ROUTE, ArrayList<UserEntity>.class).body

        UserRepository userRepository = UserRepositoryFactory.getInstance()

        ArrayList<UserEntity> users = userRepository.getUsers()

        assertThat(users).isEqualTo(usersFromDatabase)
    }
}

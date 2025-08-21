package com.samueldecarvalhodeveloper.message_queue_service.unitaries

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.HttpClient
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserDataSourceGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserInMemoryCacheGateway
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserRepository
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserRepositoryFactory
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.servlet.MockMvc

import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.DATA_SOURCE_SERVICE_URL
import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.IN_MEMORY_SERVICE_URL
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.*
import static org.assertj.core.api.Assertions.assertThat
import static org.springframework.http.MediaType.APPLICATION_JSON
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
class MessageQueueServiceApplicationTests {
    @Autowired
    private MockMvc server
    private static UserRepository userRepository
    private static UserDataSourceGateway userDataSourceGateway
    private static UserInMemoryCacheGateway userInMemoryCacheGateway

    @BeforeAll
    static void beforeAll() {
        userDataSourceGateway = new UserDataSourceGateway()
        userInMemoryCacheGateway = new UserInMemoryCacheGateway()

        userRepository = UserRepositoryFactory.getInstance()
    }

    @BeforeEach
    void beforeEach() {
        HttpClient.getDeleteRequestResponse(IN_MEMORY_SERVICE_URL + USER_ROUTE + USER_ID)

        HttpClient.getDeleteRequestResponse(DATA_SOURCE_SERVICE_URL + USER_ROUTE + USER_ID)
    }

    @AfterEach
    void afterEach() {
        HttpClient.getDeleteRequestResponse(IN_MEMORY_SERVICE_URL + USER_ROUTE + USER_ID)

        HttpClient.getDeleteRequestResponse(DATA_SOURCE_SERVICE_URL + USER_ROUTE + USER_ID)
    }

    @Test
    void testIfServerIsSetup() {
        this.server
                .perform(post(USER_ROUTE).contentType(APPLICATION_JSON).content(USER_JSON))
                .andExpect(status().isCreated())

        UserEntity createdUser = userRepository.getUser(USER_ID)

        assertThat(createdUser.id).isEqualTo(USER_ID)
        assertThat(createdUser.username).isEqualTo(USER_USERNAME)
    }
}

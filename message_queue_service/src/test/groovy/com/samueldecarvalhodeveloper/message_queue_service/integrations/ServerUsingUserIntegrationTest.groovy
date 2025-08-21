package com.samueldecarvalhodeveloper.message_queue_service.integrations

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.HttpClient
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

import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.getIN_MEMORY_SERVICE_URL
import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.getROUTE_SEPARATOR_CHARACTER
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.*
import static org.assertj.core.api.Assertions.assertThat
import static org.springframework.http.MediaType.APPLICATION_JSON
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
class ServerUsingUserIntegrationTest {
    @Autowired
    private MockMvc server
    private static UserRepository userRepository

    @BeforeAll
    static void beforeAll() {
        userRepository = UserRepositoryFactory.getInstance()
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
    void testServerUsingUserToManipulateUsersOnDatabase() {
        this.server
                .perform(post(USER_ROUTE).contentType(APPLICATION_JSON).content(USER_JSON))
                .andExpect(status().isCreated())

        UserEntity createdUser = userRepository.getUser(USER_ID)

        assertThat(createdUser.id).isEqualTo(USER_ID)
        assertThat(createdUser.username).isEqualTo(USER_USERNAME)

        this.server
                .perform(get(USER_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER))
                .andExpect(status().isOk())
                .andExpect(content().string(USER_JSON))

        UserEntity userWithWrongData = new UserEntity(USER_ID, NOT_WANTED_USER_USERNAME)

        userRepository.updateUser(userWithWrongData)

        this.server
                .perform(patch(USER_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER)
                        .contentType(APPLICATION_JSON)
                        .content(USER_JSON))
                .andExpect(status().isOk())

        UserEntity updatedUser = userRepository.getUser(USER_ID)

        assertThat(updatedUser.id).isEqualTo(USER_ID)
        assertThat(updatedUser.username).isEqualTo(USER_USERNAME)

        this.server
                .perform(delete(USER_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER))
                .andExpect(status().isNoContent())

        try {
            userRepository.getUser(USER_ID)

        } catch (Exception exception) {
            assertThat(exception.message).isNotEmpty()
        }
    }
}

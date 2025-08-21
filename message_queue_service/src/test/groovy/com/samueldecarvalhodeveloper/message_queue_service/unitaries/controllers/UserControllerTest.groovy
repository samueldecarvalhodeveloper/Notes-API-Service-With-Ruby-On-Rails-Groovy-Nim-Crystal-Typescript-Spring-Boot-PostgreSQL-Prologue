package com.samueldecarvalhodeveloper.message_queue_service.unitaries.controllers


import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.HttpClient
import com.samueldecarvalhodeveloper.message_queue_service.domains.json_parser.JsonParser
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

import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.*
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.*
import static org.assertj.core.api.Assertions.assertThat
import static org.springframework.http.MediaType.APPLICATION_JSON
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {
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

        HttpClient.getDeleteRequestResponse(DATA_SOURCE_SERVICE_URL + USER_ROUTE + USER_ID)
    }

    @AfterEach
    void afterEach() {
        HttpClient.getDeleteRequestResponse(IN_MEMORY_SERVICE_URL + USER_ROUTE + USER_ID)

        HttpClient.getDeleteRequestResponse(DATA_SOURCE_SERVICE_URL + USER_ROUTE + USER_ID)
    }

    @Test
    void testIfMethodGetAllUsersRespondsToClientAListOfAllUsersData() {
        ArrayList<UserEntity> usersFromDatabase = userRepository.getUsers()

        String jsonStringOfUsersFromDatabase = JsonParser.getJsonStringOfObject(usersFromDatabase)

        this.server
                .perform(get(USER_ROUTE))
                .andExpect(status().isOk())
                .andExpect(content().string(jsonStringOfUsersFromDatabase))
    }

    @Test
    void testIfMethodGetUserRespondsToClientUserData() {
        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        userRepository.createUser(user)

        this.server
                .perform(get(USER_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER))
                .andExpect(status().isOk())
                .andExpect(content().string(USER_JSON))
    }

    @Test
    void testIfMethodGetAllUsersRespondsToClientNotFound() {
        this.server
                .perform(get(USER_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER))
                .andExpect(status().isNotFound())
    }

    @Test
    void testIfMethodCreateUserCreatesUserOnDatabase() {
        this.server
                .perform(post(USER_ROUTE).contentType(APPLICATION_JSON).content(USER_JSON))
                .andExpect(status().isCreated())

        UserEntity createdUser = userRepository.getUser(USER_ID)

        assertThat(createdUser.id).isEqualTo(USER_ID)
        assertThat(createdUser.username).isEqualTo(USER_USERNAME)
    }

    @Test
    void testIfMethodCreateUserRespondsToClientConflictIfUserAlreadyExists() {
        userRepository.createUser(USER_OBJECT)

        this.server
                .perform(post(USER_ROUTE).contentType(APPLICATION_JSON).content(USER_JSON))
                .andExpect(status().isConflict())
    }

    @Test
    void testIfMethodUpdateUserUpdatesUserOnDatabase() {
        UserEntity user = new UserEntity(USER_ID, NOT_WANTED_USER_USERNAME)

        userRepository.createUser(user)

        this.server
                .perform(patch(USER_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER).contentType(APPLICATION_JSON).content(USER_JSON))
                .andExpect(status().isOk())

        UserEntity updatedUser = userRepository.getUser(USER_ID)

        assertThat(updatedUser.id).isEqualTo(USER_ID)
        assertThat(updatedUser.username).isEqualTo(USER_USERNAME)
    }

    @Test
    void testIfMethodUpdateUserRespondsToClientNotFoundIfUserDoesNotExist() {
        this.server
                .perform(patch(USER_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER).contentType(APPLICATION_JSON).content(USER_JSON))
                .andExpect(status().isNotFound())
    }

    @Test
    void testIfMethodDeleteUserDeletesUserOnDatabase() {
        UserEntity user = new UserEntity(USER_ID, NOT_WANTED_USER_USERNAME)

        userRepository.createUser(user)

        this.server
                .perform(delete(USER_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER + ROUTE_SEPARATOR_CHARACTER))
                .andExpect(status().isNoContent())

        try {
            userRepository.getUser(USER_ID)
        } catch (Exception exception) {
            assertThat(exception.message).isEqualTo(NOT_EXISTING_USER_EXCEPTION_MESSAGE)
        }
    }

    @Test
    void testIfMethodDeleteUserRespondsToClientNotFoundIfUserDoesNotExist() {
        this.server
                .perform(delete(USER_ROUTE + USER_ID + ROUTE_SEPARATOR_CHARACTER))
                .andExpect(status().isNotFound())
    }
}
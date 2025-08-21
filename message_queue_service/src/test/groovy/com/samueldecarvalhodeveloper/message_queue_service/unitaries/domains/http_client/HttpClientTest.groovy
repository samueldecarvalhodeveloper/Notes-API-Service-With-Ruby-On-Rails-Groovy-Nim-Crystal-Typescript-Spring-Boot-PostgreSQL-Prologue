package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.http_client

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.HttpClient
import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.infrastructure.entities.ResponseEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.infrastructure.entities.ResponseWithoutBodyEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.json_parser.JsonParser
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import de.svenkubiak.http.Http
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus

import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.IN_MEMORY_SERVICE_URL
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.HttpClientConstants.getHTTP_REQUEST_JSON_CONTENT_TYPE_HEADER_KEY
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.HttpClientConstants.getHTTP_REQUEST_JSON_CONTENT_TYPE_HEADER_VALUE
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.*
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class HttpClientTest {
    @BeforeEach
    void beforeEach() {
        Http.delete(IN_MEMORY_SERVICE_URL + USER_ROUTE + USER_ID).send()
    }

    @AfterEach
    void afterEach() {
        Http.delete(IN_MEMORY_SERVICE_URL + USER_ROUTE + USER_ID).send()
    }

    @Test
    void testIfMethodGetGetRequestResponseMakesGetAHttpRequestAndReturnsItsSerializedJsonResponse() {
        ArrayList<UserEntity> responseFromHttpClientImplementation = JsonParser.getObjectFromJsonString(
                Http.get(IN_MEMORY_SERVICE_URL + USER_ROUTE).send().body(), ArrayList<UserEntity>.class
        )

        ResponseEntity response = HttpClient.getGetRequestResponse(
                IN_MEMORY_SERVICE_URL + USER_ROUTE,
                ArrayList<UserEntity>.class
        )

        assertThat(response.statusCode).isEqualTo(HttpStatus.OK.value())
        assertThat(response.body).isEqualTo(responseFromHttpClientImplementation)
    }

    @Test
    void testIfMethodGetPostRequestResponseMakesPostHttpRequestAndReturnsItsStatusCode() {
        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        ResponseWithoutBodyEntity response = HttpClient.getPostRequestResponse(
                IN_MEMORY_SERVICE_URL + USER_ROUTE,
                user
        )

        assertThat(response.statusCode).isEqualTo(HttpStatus.CREATED.value())
    }

    @Test
    void testIfMethodGetPatchRequestResponseMakesPatchHttpRequestAndReturnsItsStatusCode() {
        UserEntity user = new UserEntity(USER_ID, NOT_WANTED_USER_USERNAME)

        HttpClient.getPostRequestResponse(
                IN_MEMORY_SERVICE_URL + USER_ROUTE,
                user
        )

        UserEntity updatedUser = new UserEntity(USER_ID, USER_USERNAME)

        ResponseWithoutBodyEntity response =
                HttpClient.getPatchRequestResponse(
                        IN_MEMORY_SERVICE_URL + USER_ROUTE + USER_ID,
                        updatedUser
                )

        assertThat(response.statusCode).isEqualTo(HttpStatus.OK.value())
    }

    @Test
    void testIfMethodGetDeleteRequestResponseMakesDeleteHttpRequestAndReturnsItsStatusCode() {
        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        String jsonStringOfUser = JsonParser.getJsonStringOfObject(user)

        Http.post(IN_MEMORY_SERVICE_URL + USER_ROUTE)
                .withHeader(
                        HTTP_REQUEST_JSON_CONTENT_TYPE_HEADER_KEY,
                        HTTP_REQUEST_JSON_CONTENT_TYPE_HEADER_VALUE
                )
                .withBody(jsonStringOfUser)
                .send()

        ResponseWithoutBodyEntity response =
                HttpClient.getDeleteRequestResponse(IN_MEMORY_SERVICE_URL + USER_ROUTE + USER_ID)

        assertThat(response.statusCode).isEqualTo(HttpStatus.NO_CONTENT.value())
    }
}

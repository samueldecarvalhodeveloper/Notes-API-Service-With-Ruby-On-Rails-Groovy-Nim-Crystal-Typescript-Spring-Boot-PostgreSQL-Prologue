package com.samueldecarvalhodeveloper.message_queue_service.integrations

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.HttpClient
import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.infrastructure.entities.ResponseEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.json_parser.JsonParser
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import de.svenkubiak.http.Http
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus

import static com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants.getIN_MEMORY_SERVICE_URL
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.getUSER_ROUTE
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class HttpClientUsingJsonParserIntegrationTest {
    @Test
    void testHttpClientParsingResponseJsonStringToAnObject() {
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
}

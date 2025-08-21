package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.http_client

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.ResponseEntityFactory
import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.infrastructure.entities.ResponseEntity
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus

import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.getUSER_JSON
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class ResponseEntityFactoryTest {
    @Test
    void testIfMethodGetInstanceReturnsAnEntityInstance() {
        ResponseEntity response = ResponseEntityFactory.getInstance(HttpStatus.OK.value(), USER_JSON)

        assertThat(response.statusCode).isEqualTo(HttpStatus.OK.value())
        assertThat(response.body).isEqualTo(USER_JSON)
    }
}

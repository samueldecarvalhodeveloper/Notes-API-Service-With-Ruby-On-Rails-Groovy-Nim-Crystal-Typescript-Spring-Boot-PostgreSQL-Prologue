package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.http_client

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.ResponseWithoutBodyEntityFactory
import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.infrastructure.entities.ResponseWithoutBodyEntity
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus

import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class ResponseWithoutBodyEntityFactoryTest {
    @Test
    void testIfMethodGetInstanceReturnsAnEntityInstance() {
        ResponseWithoutBodyEntity response = ResponseWithoutBodyEntityFactory.getInstance(HttpStatus.OK.value())

        assertThat(response.statusCode).isEqualTo(HttpStatus.OK.value())
    }
}

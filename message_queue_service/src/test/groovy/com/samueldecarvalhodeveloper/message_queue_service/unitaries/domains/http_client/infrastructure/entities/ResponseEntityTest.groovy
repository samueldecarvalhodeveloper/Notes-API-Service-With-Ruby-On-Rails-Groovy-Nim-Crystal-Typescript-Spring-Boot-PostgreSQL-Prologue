package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.http_client.infrastructure.entities

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.infrastructure.entities.ResponseEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus

import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.getUSER_ID
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.getUSER_USERNAME
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class ResponseEntityTest {
    @Test
    void testIfEntityDescribesHowResponseShouldBeUsedByTheSystem() {
        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        ResponseEntity response = new ResponseEntity<UserEntity>(HttpStatus.OK.value(), user)

        assertThat(response.statusCode).isEqualTo(HttpStatus.OK.value())
        assertThat(response.body.id).isEqualTo(USER_ID)
        assertThat(response.body.username).isEqualTo(USER_USERNAME)
    }
}

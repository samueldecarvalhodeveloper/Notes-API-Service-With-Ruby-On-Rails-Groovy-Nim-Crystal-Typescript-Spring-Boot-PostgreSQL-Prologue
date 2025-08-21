package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.user.infrastructure.exceptions

import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.exceptions.NotExistingUserException
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.NOT_EXISTING_USER_EXCEPTION_MESSAGE
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class NotExistingUserExceptionTest {
    @Test
    void testIfExceptionDescribesHowSystemShouldActWhenUserDoesNotExist() {
        try {
            throw new NotExistingUserException()
        }
        catch (Exception exception) {
            assertThat(exception.message).isEqualTo(NOT_EXISTING_USER_EXCEPTION_MESSAGE)
        }
    }
}

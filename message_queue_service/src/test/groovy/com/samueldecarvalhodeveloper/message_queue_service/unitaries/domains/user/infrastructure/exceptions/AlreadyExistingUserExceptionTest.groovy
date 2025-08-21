package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.user.infrastructure.exceptions

import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.exceptions.AlreadyExistingUserException
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.ALREADY_EXISTING_USER_EXCEPTION_MESSAGE
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class AlreadyExistingUserExceptionTest {
    @Test
    void testIfExceptionDescribesHowSystemShouldActWhenUserAlreadyExists() {
        try {
            throw new AlreadyExistingUserException()
        }
        catch (Exception exception) {
            assertThat(exception.message).isEqualTo(ALREADY_EXISTING_USER_EXCEPTION_MESSAGE)
        }
    }
}

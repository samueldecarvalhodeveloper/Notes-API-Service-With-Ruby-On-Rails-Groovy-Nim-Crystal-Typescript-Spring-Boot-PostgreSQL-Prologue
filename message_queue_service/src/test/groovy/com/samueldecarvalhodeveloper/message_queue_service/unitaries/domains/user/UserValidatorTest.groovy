package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.user

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.ResponseWithoutBodyEntityFactory
import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.infrastructure.entities.ResponseWithoutBodyEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserValidator
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus

import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.getALREADY_EXISTING_USER_EXCEPTION_MESSAGE
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.getNOT_EXISTING_USER_EXCEPTION_MESSAGE
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class UserValidatorTest {
    @Test
    void testIfMethodValidateIfUserExistsThrowsNotExistingUserExceptionIfUserDoesNotExistOnDatabase() {
        ResponseWithoutBodyEntity response =
                ResponseWithoutBodyEntityFactory.getInstance(HttpStatus.NOT_FOUND.value())

        try {
            UserValidator.validateIfUserExists(response)
        } catch (Exception exception) {
            assertThat(exception.message).isEqualTo(NOT_EXISTING_USER_EXCEPTION_MESSAGE)
        }
    }

    @Test
    void testIfMethodValidateIfUserAlreadyExistsThrowsAlreadyExistingUserExceptionIfUserAlreadyExistsOnDatabase() {
        ResponseWithoutBodyEntity response =
                ResponseWithoutBodyEntityFactory.getInstance(HttpStatus.CONFLICT.value())

        try {
            UserValidator.validateIfUserAlreadyExists(response)
        } catch (Exception exception) {
            assertThat(exception.message).isEqualTo(ALREADY_EXISTING_USER_EXCEPTION_MESSAGE)
        }
    }
}

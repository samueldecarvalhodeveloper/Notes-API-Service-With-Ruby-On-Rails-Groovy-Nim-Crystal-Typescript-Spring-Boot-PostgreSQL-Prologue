package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.user.infrastructure.specifications


import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.specifications.UserSpecifications
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus

import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class UserSpecificationsTest {
    @Test
    void testIfMethodIsUserNotFoundReturnsTrueIfResponseStatusCodeIsNotFound() {
        boolean userIsNotFound = UserSpecifications.isUserNotFound(HttpStatus.NOT_FOUND.value())
        boolean userIsFound = UserSpecifications.isUserNotFound(HttpStatus.OK.value())

        assertThat(userIsNotFound).isTrue()
        assertThat(userIsFound).isFalse()
    }

    @Test
    void testIfMethodIsUserAlreadyExistingReturnsTrueIfResponseStatusCodeIsConflict() {
        boolean userAlreadyExists = UserSpecifications.isUserAlreadyExisting(HttpStatus.CONFLICT.value())
        boolean noteNotExists = UserSpecifications.isUserAlreadyExisting(HttpStatus.NOT_FOUND.value())

        assertThat(userAlreadyExists).isTrue()
        assertThat(noteNotExists).isFalse()
    }
}

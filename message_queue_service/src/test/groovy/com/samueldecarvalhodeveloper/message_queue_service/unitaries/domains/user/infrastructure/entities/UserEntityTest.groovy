package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.user.infrastructure.entities

import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.USER_ID
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.USER_USERNAME
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class UserEntityTest {
    @Test
    void testIfEntityDescribesHowUserShouldBeUsedByTheSystem() {
        UserEntity user = new UserEntity(USER_ID, USER_USERNAME)

        assertThat(user.id).isEqualTo(USER_ID)
        assertThat(user.username).isEqualTo(USER_USERNAME)
    }
}

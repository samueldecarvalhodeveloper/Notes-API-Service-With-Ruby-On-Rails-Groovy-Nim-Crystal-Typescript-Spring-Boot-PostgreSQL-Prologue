package com.samueldecarvalhodeveloper.message_queue_service.components

import com.samueldecarvalhodeveloper.message_queue_service.domains.json_parser.JsonParser
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.getUSER_JSON
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.getUSER_OBJECT
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class JsonParserComponentTest {
    @Test
    void testConvertingObjectToAJsonString() {
        String jsonOfObject = JsonParser.getJsonStringOfObject(USER_OBJECT)

        assertThat(jsonOfObject).isEqualTo(USER_JSON)
    }

    @Test
    void testConvertingJsonStringToObject() {
        UserEntity objectFromJson = JsonParser.getObjectFromJsonString(USER_JSON, UserEntity.class)

        assertThat(objectFromJson.id).isEqualTo(USER_OBJECT.id)
        assertThat(objectFromJson.username).isEqualTo(USER_OBJECT.username)
    }
}

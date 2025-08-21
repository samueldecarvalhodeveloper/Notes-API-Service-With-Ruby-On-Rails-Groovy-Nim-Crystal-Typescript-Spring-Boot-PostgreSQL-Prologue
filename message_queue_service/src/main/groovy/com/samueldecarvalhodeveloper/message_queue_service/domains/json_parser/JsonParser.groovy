package com.samueldecarvalhodeveloper.message_queue_service.domains.json_parser

import com.fasterxml.jackson.databind.ObjectMapper

class JsonParser {
    private JsonParser() {}

    static <T> String getJsonStringOfObject(T object) {
        ObjectMapper jsonParser = new ObjectMapper()

        return jsonParser.writeValueAsString(object)
    }

    static <T> T getObjectFromJsonString(String jsonString, Class<T> object) {
        ObjectMapper jsonParser = new ObjectMapper()

        return jsonParser.readValue(
                jsonString,
                object
        )
    }
}

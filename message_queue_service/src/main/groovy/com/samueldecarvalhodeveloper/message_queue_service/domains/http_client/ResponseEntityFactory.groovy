package com.samueldecarvalhodeveloper.message_queue_service.domains.http_client

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.infrastructure.entities.ResponseEntity

class ResponseEntityFactory {
    private ResponseEntityFactory() {}

    static <T> ResponseEntity getInstance(Integer statusCode, T body) {
        return new ResponseEntity(statusCode, body)
    }
}

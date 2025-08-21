package com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.infrastructure.entities

class ResponseWithoutBodyEntity {
    final Integer statusCode

    ResponseWithoutBodyEntity(Integer statusCode) {
        this.statusCode = statusCode
    }
}

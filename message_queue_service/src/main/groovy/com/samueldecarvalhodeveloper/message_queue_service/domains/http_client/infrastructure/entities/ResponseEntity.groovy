package com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.infrastructure.entities

class ResponseEntity<T> {
    final Integer statusCode
    final T body

    ResponseEntity(Integer statusCode, T body) {
        this.statusCode = statusCode
        this.body = body
    }
}

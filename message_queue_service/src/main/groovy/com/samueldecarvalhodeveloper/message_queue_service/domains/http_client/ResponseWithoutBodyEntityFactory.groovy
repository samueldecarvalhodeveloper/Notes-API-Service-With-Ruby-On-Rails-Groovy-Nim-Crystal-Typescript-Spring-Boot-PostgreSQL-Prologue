package com.samueldecarvalhodeveloper.message_queue_service.domains.http_client


import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.infrastructure.entities.ResponseWithoutBodyEntity

class ResponseWithoutBodyEntityFactory {
    private ResponseWithoutBodyEntityFactory() {}

    static ResponseWithoutBodyEntity getInstance(Integer statusCode) {
        return new ResponseWithoutBodyEntity(statusCode)
    }
}

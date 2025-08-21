package com.samueldecarvalhodeveloper.message_queue_service.constants

class ApplicationConstants {
    private ApplicationConstants() {}

    static final String IN_MEMORY_SERVICE_URL = System.getenv("IN_MEMORY_SERVICE_URL")

    static final String DATA_SOURCE_SERVICE_URL = System.getenv("DATA_SOURCE_SERVICE_URL")

    static final String ROUTE_SEPARATOR_CHARACTER = "/"
}

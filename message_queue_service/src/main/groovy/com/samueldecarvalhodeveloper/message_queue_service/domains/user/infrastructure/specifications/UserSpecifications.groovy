package com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.specifications

import org.springframework.http.HttpStatus

class UserSpecifications {
    private UserSpecifications() {}

    static boolean isUserNotFound(Integer responseStatusCode) {
        return responseStatusCode == HttpStatus.NOT_FOUND.value()
    }

    static boolean isUserAlreadyExisting(Integer responseStatusCode) {
        return responseStatusCode == HttpStatus.CONFLICT.value()
    }
}

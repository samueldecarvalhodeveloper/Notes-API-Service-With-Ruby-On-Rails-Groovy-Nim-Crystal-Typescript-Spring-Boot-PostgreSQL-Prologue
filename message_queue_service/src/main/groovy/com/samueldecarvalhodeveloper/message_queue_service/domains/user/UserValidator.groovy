package com.samueldecarvalhodeveloper.message_queue_service.domains.user

import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.infrastructure.entities.ResponseWithoutBodyEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.exceptions.AlreadyExistingUserException
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.exceptions.NotExistingUserException

import static com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.specifications.UserSpecifications.isUserAlreadyExisting
import static com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.specifications.UserSpecifications.isUserNotFound

class UserValidator {
    private UserValidator() {}

    static void validateIfUserExists(ResponseWithoutBodyEntity response) {
        if (isUserNotFound(response.statusCode)) {
            throw new NotExistingUserException()
        }
    }

    static void validateIfUserAlreadyExists(ResponseWithoutBodyEntity response) {
        if (isUserAlreadyExisting(response.statusCode)) {
            throw new AlreadyExistingUserException()
        }
    }
}

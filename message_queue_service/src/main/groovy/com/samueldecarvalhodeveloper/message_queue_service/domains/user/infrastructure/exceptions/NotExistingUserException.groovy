package com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.exceptions

import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.NOT_EXISTING_USER_EXCEPTION_MESSAGE

class NotExistingUserException extends Exception {
    NotExistingUserException() {
        super(NOT_EXISTING_USER_EXCEPTION_MESSAGE)
    }
}

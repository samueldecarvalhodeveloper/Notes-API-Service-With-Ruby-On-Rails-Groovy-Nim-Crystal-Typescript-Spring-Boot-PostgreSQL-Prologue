package com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.exceptions

import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants.ALREADY_EXISTING_USER_EXCEPTION_MESSAGE

class AlreadyExistingUserException extends Exception {
    AlreadyExistingUserException() {
        super(ALREADY_EXISTING_USER_EXCEPTION_MESSAGE)
    }
}

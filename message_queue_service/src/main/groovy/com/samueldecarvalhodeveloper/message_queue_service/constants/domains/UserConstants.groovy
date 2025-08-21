package com.samueldecarvalhodeveloper.message_queue_service.constants.domains

import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity

class UserConstants {
    private UserConstants() {}

    static final String NOT_EXISTING_USER_EXCEPTION_MESSAGE = "User Does Not Exist"

    static final String ALREADY_EXISTING_USER_EXCEPTION_MESSAGE = "User Already Exists"

    static final String USER_ROUTE = "/users/"

    static final Integer USER_ID = 0

    static final String USER_USERNAME = "Samuel de Carvalho"

    static final String NOT_WANTED_USER_USERNAME = "Other Name"

    static UserEntity USER_OBJECT = new UserEntity(USER_ID, USER_USERNAME)

    static String USER_JSON = "{\"id\":0,\"username\":\"Samuel de Carvalho\"}"
}

package com.samueldecarvalhodeveloper.message_queue_service.domains.user

import com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants
import com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants
import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.HttpClient
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity

class UserDataSourceGateway {
    void createUserOnDataSourceDatabase(UserEntity user) {
        HttpClient.getPostRequestResponse(
                ApplicationConstants.DATA_SOURCE_SERVICE_URL + UserConstants.USER_ROUTE,
                user
        )
    }

    void updateUserOnDataSourceDatabase(UserEntity user) {
        HttpClient.getPatchRequestResponse(
                ApplicationConstants.DATA_SOURCE_SERVICE_URL + UserConstants.USER_ROUTE + user.id,
                user
        )
    }

    void deleteUserOnDataSourceDatabase(Integer id) {
        HttpClient.getDeleteRequestResponse(
                ApplicationConstants.DATA_SOURCE_SERVICE_URL + UserConstants.USER_ROUTE + id
        )
    }
}

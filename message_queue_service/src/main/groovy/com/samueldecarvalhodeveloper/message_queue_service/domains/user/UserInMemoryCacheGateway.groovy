package com.samueldecarvalhodeveloper.message_queue_service.domains.user

import com.samueldecarvalhodeveloper.message_queue_service.constants.ApplicationConstants
import com.samueldecarvalhodeveloper.message_queue_service.constants.domains.UserConstants
import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.HttpClient
import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.infrastructure.entities.ResponseEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.infrastructure.entities.ResponseWithoutBodyEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.exceptions.NotExistingUserException

class UserInMemoryCacheGateway {
    ArrayList<UserEntity> getUsersFromInMemoryDatabase() {
        ArrayList<UserEntity> users = HttpClient.getGetRequestResponse(
                ApplicationConstants.IN_MEMORY_SERVICE_URL + UserConstants.USER_ROUTE,
                ArrayList<UserEntity>.class
        ).body

        return users
    }

    UserEntity getUserFromInMemoryDatabase(Integer id) {
        try {
            ResponseEntity<UserEntity> response = HttpClient.getGetRequestResponse(
                    ApplicationConstants.IN_MEMORY_SERVICE_URL + UserConstants.USER_ROUTE + id,
                    UserEntity.class
            )

            return response.body
        } catch (Exception ignored) {
            throw new NotExistingUserException()
        }
    }

    void createUserOnInMemoryDatabase(UserEntity user) {
        ResponseWithoutBodyEntity response = HttpClient.getPostRequestResponse(
                ApplicationConstants.IN_MEMORY_SERVICE_URL + UserConstants.USER_ROUTE,
                user
        )

        UserValidator.validateIfUserAlreadyExists(response)
    }

    void updateUserOnInMemoryDatabase(UserEntity user) {
        ResponseWithoutBodyEntity response = HttpClient.getPatchRequestResponse(
                ApplicationConstants.IN_MEMORY_SERVICE_URL + UserConstants.USER_ROUTE + user.id,
                user
        )

        UserValidator.validateIfUserExists(response)
    }

    void deleteUserOnInMemoryDatabase(Integer id) {
        ResponseWithoutBodyEntity response = HttpClient.getDeleteRequestResponse(
                ApplicationConstants.IN_MEMORY_SERVICE_URL + UserConstants.USER_ROUTE + id
        )

        UserValidator.validateIfUserExists(response)
    }
}

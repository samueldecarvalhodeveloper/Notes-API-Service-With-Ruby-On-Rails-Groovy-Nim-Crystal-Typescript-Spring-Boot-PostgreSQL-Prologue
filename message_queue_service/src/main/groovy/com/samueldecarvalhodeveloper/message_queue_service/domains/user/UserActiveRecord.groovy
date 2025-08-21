package com.samueldecarvalhodeveloper.message_queue_service.domains.user

import com.samueldecarvalhodeveloper.message_queue_service.domains.event_queue.EventQueue
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity

class UserActiveRecord {
    private UserDataSourceGateway userDataSourceGateway
    private UserInMemoryCacheGateway userInMemoryCacheGateway

    UserActiveRecord(UserDataSourceGateway userDataSourceGateway, UserInMemoryCacheGateway userInMemoryCacheGateway) {
        this.userDataSourceGateway = userDataSourceGateway
        this.userInMemoryCacheGateway = userInMemoryCacheGateway
    }

    ArrayList<UserEntity> getUsersFromDatabase() {
        return userInMemoryCacheGateway.getUsersFromInMemoryDatabase()
    }

    UserEntity getUserFromDatabase(Integer id) {
        return userInMemoryCacheGateway.getUserFromInMemoryDatabase(id)
    }

    void createUserOnDatabase(UserEntity user) {
        userInMemoryCacheGateway.createUserOnInMemoryDatabase(user)

        EventQueue.addEvent {
            userDataSourceGateway.createUserOnDataSourceDatabase(user)
        }
    }

    void updateUserOnDatabase(UserEntity user) {
        userInMemoryCacheGateway.updateUserOnInMemoryDatabase(user)

        EventQueue.addEvent {
            userDataSourceGateway.updateUserOnDataSourceDatabase(user)
        }
    }

    void deleteUserOnDatabase(Integer id) {
        userInMemoryCacheGateway.deleteUserOnInMemoryDatabase(id)

        EventQueue.addEvent {
            userDataSourceGateway.deleteUserOnDataSourceDatabase(id)
        }
    }
}

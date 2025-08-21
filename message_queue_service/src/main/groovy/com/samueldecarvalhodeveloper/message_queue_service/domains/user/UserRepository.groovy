package com.samueldecarvalhodeveloper.message_queue_service.domains.user

import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity

class UserRepository {
    private UserActiveRecord userActiveRecord

    UserRepository(UserActiveRecord userActiveRecord) {
        this.userActiveRecord = userActiveRecord
    }

    ArrayList<UserEntity> getUsers() {
        return userActiveRecord.getUsersFromDatabase()
    }

    UserEntity getUser(Integer id) {
        return userActiveRecord.getUserFromDatabase(id)
    }

    void createUser(UserEntity user) {
        userActiveRecord.createUserOnDatabase(user)
    }

    void updateUser(UserEntity user) {
        userActiveRecord.updateUserOnDatabase(user)
    }

    void deleteUser(Integer id) {
        userActiveRecord.deleteUserOnDatabase(id)
    }
}

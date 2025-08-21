package com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities

class UserEntity {
    final Integer id
    final String username

    UserEntity() {}

    UserEntity(Integer id, String username) {
        this.id = id
        this.username = username
    }
}

package com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.entities

class NoteEntity {
    final Integer id
    final String title
    final String body
    final Integer createdAt
    final Integer updatedAt
    final Integer userId

    NoteEntity() {}

    NoteEntity(Integer id, String title, String body, Integer createdAt, Integer updatedAt, Integer userId) {
        this.id = id
        this.title = title
        this.body = body
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.userId = userId
    }
}

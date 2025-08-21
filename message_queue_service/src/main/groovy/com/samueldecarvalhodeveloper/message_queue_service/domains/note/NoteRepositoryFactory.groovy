package com.samueldecarvalhodeveloper.message_queue_service.domains.note

class NoteRepositoryFactory {
    private static NoteRepository noteRepository = null

    private NoteRepositoryFactory() {}

    static NoteRepository getInstance() {
        if (noteRepository == null) {
            NoteDataSourceGateway noteDataSourceGateway = new NoteDataSourceGateway()
            NoteInMemoryCacheGateway noteInMemoryCacheGateway = new NoteInMemoryCacheGateway()

            NoteActiveRecord noteActiveRecord = new NoteActiveRecord(
                    noteDataSourceGateway,
                    noteInMemoryCacheGateway
            )

            noteRepository = new NoteRepository(noteActiveRecord)
        }

        return noteRepository
    }
}

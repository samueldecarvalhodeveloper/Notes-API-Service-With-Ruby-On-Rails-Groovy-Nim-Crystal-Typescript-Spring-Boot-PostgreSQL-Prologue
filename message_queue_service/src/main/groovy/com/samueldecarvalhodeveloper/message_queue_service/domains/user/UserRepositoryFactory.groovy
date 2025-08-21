package com.samueldecarvalhodeveloper.message_queue_service.domains.user

class UserRepositoryFactory {
    private static UserRepository userRepository = null

    private UserRepositoryFactory() {}

    static UserRepository getInstance() {
        if (userRepository == null) {
            UserDataSourceGateway userDataSourceGateway = new UserDataSourceGateway()
            UserInMemoryCacheGateway userInMemoryCacheGateway = new UserInMemoryCacheGateway()

            UserActiveRecord userActiveRecord = new UserActiveRecord(
                    userDataSourceGateway,
                    userInMemoryCacheGateway
            )

            userRepository = new UserRepository(userActiveRecord)
        }

        return userRepository
    }
}

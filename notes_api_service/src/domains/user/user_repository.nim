from ./infrastructure/entities/user_entity import UserEntity
from ./user_gateway import
  getUsersFromDatabase,
  getUserFromDatabase,
  createUserOnDatabase,
  updateUserOnDatabase,
  deleteUserOnDatabase

proc getUsers*(): seq[UserEntity] =
  return getUsersFromDatabase()

proc getUser*(id: int): UserEntity =
  return getUserFromDatabase(id)

proc createUser*(user: UserEntity): void =
  createUserOnDatabase(user)

proc updateUser*(user: UserEntity): void =
  updateUserOnDatabase(user)

proc deleteUser*(id: int): void =
  deleteUserOnDatabase(id)

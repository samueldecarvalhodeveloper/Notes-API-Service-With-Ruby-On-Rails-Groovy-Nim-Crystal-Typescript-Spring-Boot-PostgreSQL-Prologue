import UserEntity from "./infrastructure/entities/user_entity";
import UserActiveRecord from "./user_active_record";

class UserRepository {
  private userActiveRecord: UserActiveRecord;

  public constructor(userActiveRecord: UserActiveRecord) {
    this.userActiveRecord = userActiveRecord;
  }

  public getUsers(): Promise<Array<UserEntity>> {
    return this.userActiveRecord.getAllUsersFromInMemoryDatabase();
  }

  public getUser(userId: number): Promise<UserEntity> {
    return this.userActiveRecord.getUserFromInMemoryDatabase(userId);
  }

  public async createUser(user: UserEntity): Promise<void> {
    await this.userActiveRecord.createUserOnInMemoryDatabase(user);
  }

  public async updateUser(user: UserEntity): Promise<void> {
    await this.userActiveRecord.updateUserOnInMemoryDatabase(user);
  }

  public async deleteUser(userId: number): Promise<void> {
    await this.userActiveRecord.deleteUserOnInMemoryDatabase(userId);
  }
}

export default UserRepository;

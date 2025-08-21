import UserEntity from "./infrastructure/entities/user_entity";

class UserEntityFactory {
  private constructor() {}

  public static getInstance(id: number, username: string): UserEntity {
    return new UserEntity(id, username);
  }
}

export default UserEntityFactory;

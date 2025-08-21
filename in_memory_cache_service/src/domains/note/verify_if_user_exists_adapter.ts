import UserRepositoryFactory from "../user/user_repository_factory";

class VerifyIfUserExistsAdapter {
  private constructor() {}

  public static async verifyIfUserExists(userId: number): Promise<void> {
    const userRepository = await UserRepositoryFactory.getInstance();

    await userRepository.getUser(userId);
  }
}

export default VerifyIfUserExistsAdapter;
